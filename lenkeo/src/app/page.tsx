import Link from "next/link";
import VenueCard from "@/components/VenueCard";
import { VENUES, areasWithVenues, venuesInArea } from "@/lib/data";

const faq = [
  { q: "Lên Kèo có mất phí không?", a: "Hoàn toàn miễn phí. Người được mời cũng không cần tạo tài khoản." },
  { q: "Web chọn quán ở giữa như thế nào?", a: "Mỗi người chọn khu vực xuất phát, Lên Kèo tính điểm giữa của cả nhóm và gợi ý các quán gần điểm đó, phù hợp mục đích đi ăn hay đi cà phê." },
  { q: "Ai được chốt kèo?", a: "Chỉ người tạo kèo được bấm chốt. Sau khi chốt, cả nhóm thấy thẻ chốt kèo với giờ, quán và nút chỉ đường." },
];

export default function Home() {
  const featured = [VENUES[3], VENUES[1], VENUES[20], VENUES[9], VENUES[5], VENUES[18]].filter(Boolean);
  return (
    <>
      <section className="mx-auto max-w-5xl px-4 pb-10 pt-12 sm:pt-20">
        <span className="chip">Hà Nội · Miễn phí · Không cần đăng ký</span>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Lên kèo nhóm bạn
          <br />
          <span className="text-brand">chốt trong 1 phút.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg text-muted">
          Hết cảnh hỏi &quot;ai rảnh?&quot; cả ngày trong nhóm chat. Tạo kèo, gửi link, mọi người chọn giờ rảnh và vote
          quán ở khoảng giữa. Xong.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/tao-keo" className="btn-primary text-lg">
            Tạo kèo ngay →
          </Link>
          <Link href="/quan" className="btn-ghost text-lg">
            Xem quán hot
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["1", "Tạo kèo & gửi link", "Đặt tên kèo, chọn mấy ngày dự kiến, gửi link vào nhóm Zalo, Messenger."],
            ["2", "Mọi người tự điền", "Mỗi người chọn tên, tick giờ rảnh và khu vực xuất phát. Không cần tài khoản."],
            ["3", "Vote & chốt", "Web gợi ý quán ở giữa, cả nhóm vote realtime, chủ kèo bấm chốt."],
          ].map(([n, t, d]) => (
            <div key={n} className="card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
                {n}
              </span>
              <h2 className="mt-4 text-lg font-bold">{t}</h2>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-extrabold">Quán đang hot cho nhóm</h2>
          <Link href="/quan" className="text-sm font-semibold text-brand">
            Xem tất cả →
          </Link>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((v) => (
            <VenueCard key={v.slug} v={v} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-6">
        <h2 className="text-2xl font-extrabold">Tìm quán theo khu vực</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {areasWithVenues().map((a) => (
            <Link key={a.slug} href={`/quan/${a.slug}`} className="btn-ghost">
              {a.name} <span className="text-muted">({venuesInArea(a.slug).length})</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="text-2xl font-extrabold">Câu hỏi thường gặp</h2>
        <div className="mt-4 space-y-3">
          {faq.map((f) => (
            <details key={f.q} className="card p-5">
              <summary className="cursor-pointer font-semibold">{f.q}</summary>
              <p className="mt-2 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      </section>
    </>
  );
}
