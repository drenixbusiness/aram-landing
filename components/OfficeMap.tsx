"use client";

import { useEffect, useRef, useState } from "react";
import { LocateFixed, Minus, Plus } from "lucide-react";
import type { Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { DIRECTIONS_URL, OFFICE_COORDS } from "@/lib/site";

const STYLE_URL = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";
const CARTO_KEY = process.env.NEXT_PUBLIC_CARTO_KEY;
const HOME_ZOOM = 14.2;

// Repaint the Positron basemap in the page's paper, ink and gold palette.
const PAINT: [RegExp, string, string][] = [
  [/^background$/, "background-color", "#f3f1ec"],
  [/^water$/, "fill-color", "#dde3e4"],
  [/^water_shadow$/, "fill-color", "#d3dadb"],
  [/^landcover$|^park_/, "fill-color", "#e8e9dc"],
  [/^landuse/, "fill-color", "#efede6"],
  [/^building$/, "fill-color", "#e7e3db"],
  [/^building-top$/, "fill-color", "#ece9e2"],
  [/^(road|bridge|tunnel)_(service|minor|path)_fill/, "line-color", "#ffffff"],
  [/^(road|bridge|tunnel)_(sec|pri|trunk|mot)_fill/, "line-color", "#f1dfbd"],
  [/^(road|bridge|tunnel)_(sec|pri|trunk|mot)_case/, "line-color", "#e2cb9f"],
  [/^(road|bridge|tunnel)_(service|minor)_case/, "line-color", "#e2ded6"],
  [/^rail/, "line-color", "#d8d3ca"],
  [/^roadname|^place_/, "text-color", "#6e6a63"],
];

export default function OfficeMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [state, setState] = useState<"idle" | "ready" | "failed">("idle");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;

    // Load the map library only when the map is about to scroll into view.
    const io = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        try {
          const { Map, Marker, setWorkerUrl } = await import("maplibre-gl");
          setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
          if (cancelled) return;

          const m = new Map({
            container: el,
            style: STYLE_URL,
            center: OFFICE_COORDS,
            zoom: HOME_ZOOM - 1.2,
            minZoom: 4,
            maxZoom: 18,
            cooperativeGestures: true,
            attributionControl: false,
            transformRequest: (url: string) =>
              CARTO_KEY && url.includes("cartocdn.com")
                ? { url: `${url}${url.includes("?") ? "&" : "?"}api_key=${encodeURIComponent(CARTO_KEY)}` }
                : { url },
          });
          mapRef.current = m;

          const marker = document.createElement("div");
          marker.className = "map-marker";
          marker.setAttribute("aria-hidden", "true");
          marker.innerHTML = '<span class="map-marker-pulse"></span><span class="map-marker-halo"></span><span class="map-marker-dot"></span>';
          new Marker({ element: marker, anchor: "center" }).setLngLat(OFFICE_COORDS).addTo(m);

          m.on("style.load", () => {
            for (const layer of m.getStyle().layers) {
              for (const [re, prop, color] of PAINT) {
                if (!re.test(layer.id)) continue;
                try {
                  m.setPaintProperty(layer.id, prop as never, color as never);
                } catch {
                  /* property not on this layer type */
                }
              }
            }
          });
          m.once("load", () => {
            if (cancelled) return;
            setState("ready");
            // A slow, quiet settle toward the office once tiles are in.
            m.easeTo({ zoom: HOME_ZOOM, duration: 2400, easing: (t) => 1 - Math.pow(1 - t, 3) });
          });
          m.on("error", (e) => console.warn("[map]", e.error?.message));
        } catch {
          setState("failed");
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  const ready = state === "ready";
  const zoomBy = (d: number) => mapRef.current?.easeTo({ zoom: mapRef.current.getZoom() + d, duration: 300 });
  const recenter = () => mapRef.current?.flyTo({ center: OFFICE_COORDS, zoom: HOME_ZOOM, duration: 1200, essential: true });

  return (
    <div className={`plate plate--map${ready ? " is-ready" : ""}`}>
      <div
        ref={containerRef}
        className="map-canvas"
        role="region"
        aria-label="Map showing the ARAM Logistics Inc office in Elmwood Park, Illinois"
      />

      <div className="map-controls">
        <div className="map-zoom">
          <button type="button" aria-label="Zoom in" onClick={() => zoomBy(1)} disabled={!ready}>
            <Plus aria-hidden />
          </button>
          <button type="button" aria-label="Zoom out" onClick={() => zoomBy(-1)} disabled={!ready}>
            <Minus aria-hidden />
          </button>
        </div>
        <button type="button" className="map-recenter" aria-label="Back to the office" onClick={recenter} disabled={!ready}>
          <LocateFixed aria-hidden />
        </button>
      </div>

      <p className="map-attrib">
        ©{" "}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">
          OpenStreetMap
        </a>{" "}
        ©{" "}
        <a href="https://carto.com/attributions" target="_blank" rel="noopener">
          CARTO
        </a>
      </p>

      {state === "failed" && (
        <a className="map-fallback" href={DIRECTIONS_URL} target="_blank" rel="noopener">
          39 W Conti Pkwy, Apt 1W, Elmwood Park, IL 60707
        </a>
      )}
    </div>
  );
}
