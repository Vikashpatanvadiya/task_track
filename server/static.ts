import express, { type Express } from "express";
import fs from "fs";
import path from "path";

// Files that must never be served stale, or the PWA can pin itself to an old
// build: the service worker script, the manifest, and the app shell HTML.
const NO_CACHE = new Set(["/sw.js", "/manifest.webmanifest", "/index.html"]);

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(
    express.static(distPath, {
      setHeaders: (res, filePath) => {
        const url = "/" + path.relative(distPath, filePath).split(path.sep).join("/");

        if (NO_CACHE.has(url)) {
          res.setHeader("Cache-Control", "no-cache, must-revalidate");
          if (url === "/sw.js") {
            // Allow the worker to control the whole origin.
            res.setHeader("Service-Worker-Allowed", "/");
          }
          return;
        }

        // Vite emits content-hashed filenames under /assets, so these are safe
        // to cache aggressively.
        if (url.startsWith("/assets/")) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      },
    }),
  );

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
