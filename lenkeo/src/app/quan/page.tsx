import type { Metadata } from "next";
import Link from "next/link";
import VenueBrowser from "@/components/VenueBrowser";
import { VENUES, SITE_URL, areasWithVenues } from "@/lib/data";

export const metadata: Metadata = {
  title: "Quán ăn, cà phê hợp đi nhóm ở Hà Nội",
  description:
    "Danh sách quán lẩu, nướng, cà phê view đẹp hợp đi nhóm bạn 20–35 tuổi ở Hà Nội: giá tham khảo, giờ mở cửa, lý do nên đến.",
  alternates: { canonical: "/quan" },
};

export default function QuanPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="display text-4xl">Quán hợp đi nhóm ở Hà Nội</h1>
      <p className="mt-2 max-w-2xl text-muted">
        Quán ăn và cà phê được giới trẻ hay rủ nhau đến. Chọn quán rồi bấm &quot;Lên kèo ở đây&quot; để mời cả nhóm.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {areasWithVenues().map((a) => (
          <Link key={a.slug} href={`/quan/${a.slug}`} className="chip hover:bg-brand hover:text-white">
            Quán ở {a.name}
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <VenueBrowser venues={VENUES} />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: VENUES.map((v, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_URL}/q/${v.slug}`,
              name: v.name,
            })),
          }),
        }}
      />
    </div>
  );
}
