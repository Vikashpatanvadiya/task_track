// Thin entry for the Vercel serverless function. The real handler is bundled
// from server/vercel.ts into _handler.cjs by `npm run build` — see the note in
// server/vercel.ts for why the function is built here rather than by the
// platform's own bundler.
//
// Node does not unwrap a CJS module's `default` for ESM importers, so the
// import lands on module.exports itself. Take `.default` when it's there.
import mod from "./_handler.cjs";

export default mod.default ?? mod;
