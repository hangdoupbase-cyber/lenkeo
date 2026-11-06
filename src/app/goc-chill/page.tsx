import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getGuides, urlFor } from "@/lib/sanity";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Góc chill – gợi ý quán ăn, cà phê cho nhóm bạn ở Hà Nội",
  description: "Bài gợi ý quán ăn, cà phê, chỗ đi chơi cho nhóm bạn ở Hà Nội, theo từng khu vực và dịp.",
  alternates: { canonical: "/goc-chill" },
};

export default async function GocChill() {
  const guides = await getGuides();
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="display text-4xl sm:text-5xl">Góc chill</h1>
      <p className="mt-3 max-w-xl text-muted">Gợi ý chỗ ăn, chỗ ngồi, chỗ đi chơi cho nhóm bạn ở Hà Nội.</p>
      {guides.length === 0 ? (
        <p className="card mt-8 p-6 text-muted">Chưa có bài nào. Bài mới sẽ xuất hiện ở đây.</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((g) => (
            <Link key={g._id} href={`/goc-chill/${g.slug}`} className="card block overflow-hidden hover:-translate-y-0.5">
              {g.cover && (
                <Image src={urlFor(g.cover).width(800).height(500).fit("crop").url()} alt={g.cover.alt || g.title} width={800} height={500} className="aspect-[16/10] w-full object-cover" />
              )}
              <div className="p-5">
                {g.area && <p className="text-xs font-medium text-muted">{g.area}</p>}
                <h2 className="display mt-1 text-xl">{g.title}</h2>
                {g.excerpt && <p className="mt-2 text-sm text-muted">{g.excerpt}</p>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
