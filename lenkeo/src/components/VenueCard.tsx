import Link from "next/link";
import { areaBySlug, type Venue } from "@/lib/data";

function Icon({ kind }: { kind: Venue["kind"] }) {
  const common = { width: 28, height: 28, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  return kind === "an" ? (
    <svg {...common}>
      <path d="M3 12h18a9 9 0 0 1-18 0z" />
      <path d="M8 8c0-1.5 1.5-1.5 1.5-3M12 8c0-1.5 1.5-1.5 1.5-3M16 8c0-1.5 1.5-1.5 1.5-3" />
    </svg>
  ) : (
    <svg {...common}>
      <path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z" />
      <path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16" />
      <path d="M8 3c0 1.2 1 1.2 1 2.4M12 3c0 1.2 1 1.2 1 2.4" />
    </svg>
  );
}

export default function VenueCard({ v }: { v: Venue }) {
  const area = areaBySlug(v.area);
  return (
    <Link href={`/q/${v.slug}`} className="card group block p-5 hover:-translate-y-0.5 hover:border-edge">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted">
            {v.kind === "an" ? "Quán ăn" : "Cà phê"} · {v.category}
          </p>
          <h3 className="display mt-1 text-xl leading-snug">{v.name}</h3>
        </div>
        <span className="shrink-0 rounded-full bg-sun-soft p-2.5 text-brand">
          <Icon kind={v.kind} />
        </span>
      </div>
      <p className="mt-2 text-sm text-muted">
        {v.address.includes(area?.name || "~") ? v.address : `${v.address}, ${area?.name}`}
      </p>
      <p className="mt-3 text-sm leading-relaxed">{v.why}</p>
      <div className="mt-4 flex items-center gap-2 text-sm text-muted">
        <span className="font-medium text-ink">{v.price ?? ""}</span>
        <span className="leader" />
        <span>{v.hours ?? ""}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {v.tags.slice(0, 3).map((t) => (
          <span key={t} className="chip">{t}</span>
        ))}
      </div>
    </Link>
  );
}
