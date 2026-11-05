"use client";

import { useMemo, useState } from "react";
import VenueCard from "./VenueCard";
import { areasWithVenues, type Venue } from "@/lib/data";

export default function VenueBrowser({ venues }: { venues: Venue[] }) {
  const [kind, setKind] = useState<"all" | "an" | "cafe">("all");
  const [area, setArea] = useState("all");
  const [q, setQ] = useState("");
  const list = useMemo(
    () =>
      venues.filter(
        (v) =>
          (kind === "all" || v.kind === kind) &&
          (area === "all" || v.area === area) &&
          (q === "" || `${v.name} ${v.category} ${v.address} ${v.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase()))
      ),
    [venues, kind, area, q]
  );
  return (
    <div>
      <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <input className="input sm:max-w-xs" placeholder="Tìm lẩu, rooftop, view hồ…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex gap-2">
          {([
            ["all", "Tất cả"],
            ["an", "🍲 Ăn"],
            ["cafe", "☕ Cà phê"],
          ] as const).map(([k, l]) => (
            <button
              key={k}
              onClick={() => setKind(k)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${kind === k ? "bg-brand text-white" : "bg-brand-soft"}`}
            >
              {l}
            </button>
          ))}
        </div>
        <select className="input sm:max-w-[180px]" value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="all">Mọi khu vực</option>
          {areasWithVenues().map((a) => (
            <option key={a.slug} value={a.slug}>
              {a.name}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-4 text-sm text-muted">{list.length} quán</p>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((v) => (
          <VenueCard key={v.slug} v={v} />
        ))}
      </div>
    </div>
  );
}
