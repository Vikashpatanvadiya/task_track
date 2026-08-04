/**
 * Service worker registration + update handling.
 *
 * The worker itself lives in `client/public/sw.js` so it is served from the
 * origin root, which is required for it to control every route.
 */

export type UpdateListener = (applyUpdate: () => void) => void;

let onUpdateAvailable: UpdateListener | undefined;

export function setUpdateListener(listener: UpdateListener) {
  onUpdateAvailable = listener;
}

function promptForUpdate(worker: ServiceWorker) {
  const applyUpdate = () => {
    worker.postMessage("SKIP_WAITING");
  };
  if (onUpdateAvailable) {
    onUpdateAvailable(applyUpdate);
  } else {
    // No UI listening yet — take the update on the next load rather than
    // reloading out from under the user mid-edit.
    applyUpdate();
  }
}

export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  // Vite dev serves the app through its own middleware; a worker caching the
  // shell there fights HMR. Dev and prod usually share localhost:<PORT>, so
  // tear down any worker left behind by a production run on this origin.
  if (import.meta.env.DEV) {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      })
      .catch(() => {});
    caches
      ?.keys()
      .then((keys) =>
        keys.filter((k) => k.startsWith("bansi-")).forEach((k) => caches.delete(k)),
      )
      .catch(() => {});
    return;
  }

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });

      // A worker was already waiting when this page loaded.
      if (registration.waiting && navigator.serviceWorker.controller) {
        promptForUpdate(registration.waiting);
      }

      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        if (!installing) return;

        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            promptForUpdate(installing);
          }
        });
      });

      // Check for a new deploy when the app is brought back to the foreground.
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
          registration.update().catch(() => {});
        }
      });
    } catch (err) {
      console.warn("Service worker registration failed:", err);
    }
  });

  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}

/** True when running from the home screen rather than a browser tab. */
export function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isIos() {
  return (
    /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
    // iPadOS 13+ reports as a Mac, but is the only "Mac" with touch.
    (window.navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}
