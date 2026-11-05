import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import VenueCard from "@/components/VenueCard";
import { SITE_URL, areaBySlug, areasWithVenues, venuesInArea } from "@/lib/data";

type Props = { params: Promise<{ khuVuc: string }> };

export function generateStaticParams() {
  return areasWithVenues().map((a) => ({ khuVuc: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { khuVuc } = await params;
  const area = areaBySlug(khuVuc);
  if (!area) return {};
  return {
    title: `Quán ăn, cà phê đi nhóm ở ${area.name}`,
    description: `Gợi ý ${venuesInArea(area.slug).length} quán lẩu, nướng, cà phê hợp đi nhóm bạn ở ${area.name}, Hà Nội. ${area.intro}`,
    alternates: { canonical: `/quan/${area.slug}` },
  };
}

export default async function AreaPage({ params }: Props) {
  const { khuVuc } = await params;
  const area = areaBySlug(khuVuc);
  if (!area) notFound();
  const venues = venuesInArea(area.slug);
  const an = venues.filter((v) => v.kind === "an");
  const cafe = venues.filter((v) => v.kind === "cafe");
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <nav className="text-sm text-muted">
        <Link href="/quan" className="hover:text-brand">
          Quán
        </Link>{" "}
        / {area.name}
      </nav>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Quán đi nhóm ở {area.name}</h1>
      <p className="mt-3 max-w-2xl text-muted">{area.intro}</p>
      <Link href="/tao-keo" className="btn-primary mt-6">
        Lên kèo ở {area.name} →
      </Link>
      {an.length > 0 && (
        <>
          <h2 className="mt-10 text-2xl font-bold">🍲 Quán ăn</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {an.map((v) => (
              <VenueCard key={v.slug} v={v} />
            ))}
          </div>
        </>
      )}
      {cafe.length > 0 && (
        <>
          <h2 className="mt-10 text-2xl font-bold">☕ Cà phê</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cafe.map((v) => (
              <VenueCard key={v.slug} v={v} />
            ))}
          </div>
        </>
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Quán", item: `${SITE_URL}/quan` },
              { "@type": "ListItem", position: 2, name: area.name, item: `${SITE_URL}/quan/${area.slug}` },
            ],
          }),
        }}
      />
    </div>
  );
}
