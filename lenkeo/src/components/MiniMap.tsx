"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

export type Pin = { lat: number; lng: number; label: string; kind: "person" | "mid" | "venue" | "final" };

const COLORS: Record<Pin["kind"], string> = {
  person: "#2b6cb0",
  mid: "#111111",
  venue: "#f05a28",
  final: "#16a34a",
};

export default function MiniMap({ pins, height = 260 }: { pins: Pin[]; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current) return;
      if (!mapRef.current) {
        mapRef.current = L.map(ref.current, { scrollWheelZoom: false, attributionControl: true }).setView([21.03, 105.84], 12);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap",
        }).addTo(mapRef.current);
        layerRef.current = L.layerGroup().addTo(mapRef.current);
      }
      const layer = layerRef.current!;
      layer.clearLayers();
      pins.forEach((p) => {
        L.circleMarker([p.lat, p.lng], {
          radius: p.kind === "mid" ? 7 : p.kind === "person" ? 6 : 9,
          color: "#fff",
          weight: 2,
          fillColor: COLORS[p.kind],
          fillOpacity: 1,
        })
          .bindTooltip(p.label, { direction: "top" })
          .addTo(layer);
      });
      if (pins.length) {
        const b = L.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number]));
        mapRef.current.fitBounds(b, { padding: [30, 30], maxZoom: 15 });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pins]);

  useEffect(
    () => () => {
      mapRef.current?.remove();
      mapRef.current = null;
    },
    []
  );

  return <div ref={ref} style={{ height }} className="z-0 overflow-hidden rounded-3xl border border-line" />;
}
