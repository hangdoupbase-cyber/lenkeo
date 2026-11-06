import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getVenuePhotos, urlFor } from "@/lib/sanity";
import VenueCard from "@/components/VenueCard";
import { SITE_URL, VENUES, areaBySlug, distanceKm, venueBySlug } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return VENUES.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const v = venueBySlug(slug);
  if (!v) return {};
  const area = areaBySlug(v.area);
  return {
    title: `${v.name} – ${v.category} ${area?.name ?? ""}`,
    description: `${v.name} (${v.address}). ${v.why} ${v.price ? `Giá tham khảo ${v.price}.` : ""} Hợp đi nhóm bạn, lên kèo nhanh với Lên Kèo.`,
    alternates: { canonical: `/q/${v.slug}` },
  };
}

export default async function VenuePage({ params }: Props) {
  const { slug } = await params;
  const v = venueBySlug(slug);
  if (!v) notFound();
  const area = areaBySlug(v.area)!;
  const photos = await getVenuePhotos(v.slug);
  const nearby = VENUES.filter((x) => x.slug !== v.slug)
    .map((x) => ({ x, km: distanceKm(v.lat, v.lng, x.lat, x.lng) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, 3);
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${v.name} ${v.address} Hà Nội`)}`;
  const facts: [string, string | undefined][] = [
    ["Địa chỉ", v.address],
    ["Giá tham khảo", v.price],
    ["Giờ mở cửa", v.hours],
    ["Loại", `${v.kind === "an" ? "Quán ăn" : "Cà phê"} · ${v.category}`],
  ];
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 pb-28">
      <nav className="text-sm text-muted">
        <Link href="/quan" className="hover:text-brand">
          Quán
        </Link>{" "}
        /{" "}
        <Link href={`/quan/${area.slug}`} className="hover:text-brand">
          {area.name}
        </Link>
      </nav>
      {photos.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {photos.slice(0, 4).map((p, i) => (
            <Image key={i} src={urlFor(p.photo).width(900).height(600).fit("crop").url()} alt={p.caption || v.name} width={900} height={600} className={`w-full rounded-3xl object-cover ${i === 0 && photos.length % 2 === 1 ? "sm:col-span-2" : ""}`} priority={i === 0} />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex h-40 items-center justify-center rounded-3xl border border-line bg-sun-soft/60 text-brand sm:h-52">
          <span className="display text-3xl">{v.kind === "an" ? "Bữa ngon" : "Ly cà phê"}</span>
        </div>
      )}
      <h1 className="display mt-6 text-4xl sm:text-5xl">{v.name}</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        {v.tags.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>
      <p className="mt-5 text-lg">{v.why}</p>
      <dl className="card mt-6 divide-y divide-line">
        {facts
          .filter(([, val]) => val)
          .map(([k, val]) => (
            <div key={k} className="flex justify-between gap-4 px-5 py-3 text-sm">
              <dt className="text-muted">{k}</dt>
              <dd className="text-right font-medium">{val}</dd>
            </div>
          ))}
      </dl>
      <div className="mt-4 flex flex-wrap gap-3">
        <a href={maps} target="_blank" rel="noopener" className="btn-ghost">
          📍 Mở Google Maps
        </a>
      </div>
      <p className="mt-3 text-xs text-muted">Nguồn tham khảo: {v.source}. Thông tin có thể thay đổi, nên gọi quán trước khi đến.</p>

      <h2 className="mt-12 text-2xl font-bold">Quán gần đây để đi tiếp</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {nearby.map(({ x }) => (
          <VenueCard key={x.slug} v={x} />
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/95 p-3 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <p className="text-sm font-semibold">Rủ cả nhóm đến {v.name}?</p>
          <Link href={`/tao-keo?quan=${v.slug}`} className="btn-primary">
            Lên kèo ở đây
          </Link>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": v.kind === "an" ? "Restaurant" : "CafeOrCoffeeShop",
            name: v.name,
            url: `${SITE_URL}/q/${v.slug}`,
            address: {
              "@type": "PostalAddress",
              streetAddress: v.address,
              addressLocality: "Hà Nội",
              addressCountry: "VN",
            },
            geo: { "@type": "GeoCoordinates", latitude: v.lat, longitude: v.lng },
            ...(v.price ? { priceRange: v.price } : {}),
            servesCuisine: v.category,
          }),
        }}
      />
    </div>
  );
}
