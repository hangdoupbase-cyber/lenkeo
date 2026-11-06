import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource/be-vietnam-pro/400.css";
import "@fontsource/be-vietnam-pro/500.css";
import "@fontsource/be-vietnam-pro/600.css";
import "@fontsource/be-vietnam-pro/700.css";
import "./globals.css";
import { SITE_URL } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lên Kèo – Chốt kèo nhóm bạn trong 1 phút",
    template: "%s | Lên Kèo",
  },
  description:
    "Tạo kèo, gửi link vào nhóm chat, cả nhóm chọn giờ rảnh và vote quán ăn, cà phê ở khoảng giữa mọi người tại Hà Nội.",
  openGraph: {
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Lên Kèo – chốt kèo nhóm bạn trong 1 phút" }],
    type: "website",
    locale: "vi_VN",
    siteName: "Lên Kèo",
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f4ece0",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="min-h-screen antialiased">
        <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-ink">
              <span className="display flex items-center gap-2 text-2xl"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 3c0 1.2 1 1.2 1 2.4M12 3c0 1.2 1 1.2 1 2.4"/></svg>Lên <span className="neon">kèo</span></span>
            </Link>
            <nav className="flex items-center gap-2 text-sm font-medium">
              <Link href="/quan" className="rounded-full px-3 py-2 hover:bg-sun-soft">
                Quán
              </Link>
              <Link href="/tao-keo" className="btn-primary !px-4 !py-2 text-sm">
                Tạo kèo
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t border-line bg-card">
          <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-muted">
            <p className="display text-lg text-ink">Lên kèo</p>
            <p className="mt-1">Chốt kèo nhóm bạn ở Hà Nội, nhẹ nhàng thôi. Bản preview, thông tin quán đang được cập nhật.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
