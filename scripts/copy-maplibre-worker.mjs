// MapLibre's ESM build loads its web worker from a separate file that the Next bundler
// doesn't emit, so serve the worker (and the shared chunk it imports) from /public.
import { copyFileSync, mkdirSync } from "node:fs";

const src = "node_modules/maplibre-gl/dist";
const dest = "public/maplibre";
mkdirSync(dest, { recursive: true });
for (const f of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) copyFileSync(`${src}/${f}`, `${dest}/${f}`);
console.log("maplibre worker copied to", dest);
