/**
 * The API as a serverless handler.
 *
 * This file is never deployed as-is. `script/build.ts` bundles it — and
 * everything it imports — into a single self-contained `api/_handler.cjs`,
 * which the thin `api/index.js` entry re-exports. That indirection exists
 * because the platform bundler would not resolve this project's relative
 * imports into `server/` ("Cannot find module '/var/task/server/routes'"),
 * so the function is built here instead, the same way `dist/index.cjs` is.
 */
import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
// `./routes` is imported lazily inside initializeRoutes. It reaches db.ts,
// which throws when DATABASE_URL is unset — at module load that kills the
// function before any handler runs, and the platform can only report an opaque
// FUNCTION_INVOCATION_FAILED. Deferring it makes the error catchable and
// reportable. esbuild keeps the lazy import inside this bundle.

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    limit: "10mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false, limit: "10mb" }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

let routesInitialized = false;

async function initializeRoutes() {
  if (!routesInitialized) {
    const { registerRoutes } = await import("./routes");
    await registerRoutes(httpServer, app);

    // Unmatched /api paths are a 404, not a fall-through to nothing.
    app.use("/api/{*path}", (_req, res) => {
      res.status(404).json({ message: "Not found" });
    });

    app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error("Internal Server Error:", err);

      if (res.headersSent) {
        return next(err);
      }

      return res.status(status).json({ message });
    });

    // No static serving here. Vercel serves the client build straight from the
    // output directory, and vercel.json rewrites unknown paths to /index.html
    // for the SPA — this function only answers /api.

    routesInitialized = true;
  }
}

export default async function handler(req: any, res: any) {
  try {
    await initializeRoutes();
  } catch (err: any) {
    // Startup failures (a missing DATABASE_URL, for example) would otherwise
    // surface as an opaque FUNCTION_INVOCATION_FAILED with nothing to go on.
    console.error("Startup failed:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ message: `Startup failed: ${err?.message ?? err}` }));
  }
  return app(req, res);
}
