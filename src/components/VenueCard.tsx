import Link from "next/link";
import { areaBySlug, type Venue } from "@/lib/data";

export default function VenueCard({ v }: { v: Venue }) {
  const area = areaBySlug(v.area);
  return (
    <Link href={`/q/${v.slug}`} className="card group block p-5 transition hover:-translate-y-0.5 hover:border-brand">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand">
            {v.kind === "an" ? "Quán ăn" : "Cà phê"} · {v.category}
          </p>
          <h3 className="mt-1 text-lg font-bold leading-snug group-hover:text-brand">{v.name}</h3>
        </div>
        <span className="text-2xl" aria-hidden>
          {v.kind === "an" ? "🍲" : "☕"}
        </span>
      </div>
      <p className="mt-2 text-sm text-muted">
        {v.address.includes(area?.name || "~") ? v.address : `${v.address}, ${area?.name}`}
      </p>
      <p className="mt-3 text-sm">{v.why}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {v.price && <span className="chip">{v.price}</span>}
        {v.hours && <span className="chip">{v.hours}</span>}
        {v.tags.slice(0, 2).map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
