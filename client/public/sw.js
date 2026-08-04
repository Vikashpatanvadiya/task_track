/* Bansi.R service worker — app shell caching + offline support.
 *
 * Bump CACHE_VERSION whenever the caching strategy changes; old caches are
 * dropped on activate. Hashed build assets are handled at runtime, so a
 * regular deploy does NOT need a version bump.
 */
const CACHE_VERSION = "v1";
const SHELL_CACHE = `bansi-shell-${CACHE_VERSION}`;
const ASSET_CACHE = `bansi-assets-${CACHE_VERSION}`;
const API_CACHE = `bansi-api-${CACHE_VERSION}`;
const FONT_CACHE = `bansi-fonts-${CACHE_VERSION}`;

const CURRENT_CACHES = [SHELL_CACHE, ASSET_CACHE, API_CACHE, FONT_CACHE];

// The navigation fallback. Everything else is cached on demand.
const SHELL_URL = "/";
const PRECACHE = [
  SHELL_URL,
  "/manifest.webmanifest",
  "/favicon.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-192-maskable.png",
  "/icons/icon-512-maskable.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(SHELL_CACHE);
      // Individual failures must not abort the whole install.
      await Promise.allSettled(
        PRECACHE.map((url) =>
          cache.add(new Request(url, { cache: "reload" })),
        ),
      );
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key.startsWith("bansi-") && !CURRENT_CACHES.includes(key))
          .map((key) => caches.delete(key)),
      );
      if (self.registration.navigationPreload) {
        await self.registration.navigationPreload.enable();
      }
      await self.clients.claim();
    })(),
  );
});

// Lets the page trigger an immediate update (see registerServiceWorker).
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
  if (event.data === "CLEAR_CACHES") {
    event.waitUntil(
      caches.keys().then((keys) =>
        Promise.all(
          keys.filter((k) => k.startsWith("bansi-")).map((k) => caches.delete(k)),
        ),
      ),
    );
  }
});

function isFontRequest(url) {
  return (
    url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com"
  );
}

function isHashedAsset(url) {
  // The worker script itself is versioned by the browser, never by us.
  if (url.pathname === "/sw.js") return false;
  return (
    url.pathname.startsWith("/assets/") ||
    /\.(?:js|css|woff2?|ttf|otf|png|jpg|jpeg|svg|gif|webp|avif|ico)$/i.test(
      url.pathname,
    )
  );
}

/** Network first, falling back to whatever we cached last. */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}

/** Serve from cache immediately, refresh in the background. */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then((response) => {
      // Opaque cross-origin responses (Google Fonts) are still worth caching.
      if (response && (response.ok || response.type === "opaque")) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  return cached || (await network) || Response.error();
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never interfere with non-GET traffic — writes must always hit the network.
  if (request.method !== "GET") return;

  // Page loads: network first so the user gets fresh HTML, with the cached
  // app shell as the offline fallback (this is what makes the installed
  // app open without a connection).
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloaded = await event.preloadResponse;
          if (preloaded) return preloaded;
          const response = await fetch(request);
          const cache = await caches.open(SHELL_CACHE);
          cache.put(SHELL_URL, response.clone());
          return response;
        } catch (err) {
          const cache = await caches.open(SHELL_CACHE);
          const shell = await cache.match(SHELL_URL);
          if (shell) return shell;
          return new Response(
            "<!doctype html><meta charset='utf-8'><title>Offline</title>" +
              "<body style=\"font-family:system-ui;display:grid;place-items:center;" +
              "height:100vh;margin:0;background:#FDFCFA;color:#18181B\">" +
              "<div style='text-align:center'><h1>You're offline</h1>" +
              "<p>Reconnect to load Bansi.R.</p></div>",
            { status: 503, headers: { "Content-Type": "text/html" } },
          );
        }
      })(),
    );
    return;
  }

  if (isFontRequest(url)) {
    event.respondWith(staleWhileRevalidate(request, FONT_CACHE));
    return;
  }

  // Only same-origin traffic beyond this point.
  if (url.origin !== self.location.origin) return;

  // Manifest + icons live in the shell cache (precached at install), so the
  // install banner and app icon work on a cold offline start.
  if (
    url.pathname === "/manifest.webmanifest" ||
    url.pathname === "/favicon.png" ||
    url.pathname.startsWith("/icons/")
  ) {
    event.respondWith(staleWhileRevalidate(request, SHELL_CACHE));
    return;
  }

  // API reads: fresh when online, last-known data when offline.
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  if (isHashedAsset(url)) {
    event.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
  }
});
