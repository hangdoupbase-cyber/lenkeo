import type { Metadata, Viewport } from "next";
import Link from "next/link";
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
    type: "website",
    locale: "vi_VN",
    siteName: "Lên Kèo",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#f05a28",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">
        <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="text-xl font-extrabold tracking-tight">
              Lên <span className="text-brand">Kèo</span>
            </Link>
            <nav className="flex items-center gap-2 text-sm font-medium">
              <Link href="/quan" className="rounded-full px-3 py-2 hover:bg-brand-soft">
                Quán
              </Link>
              <Link href="/tao-keo" className="btn-primary !px-4 !py-2 text-sm">
                Tạo kèo
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-16 border-t border-line">
          <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-muted">
            <p className="font-semibold text-ink">Lên Kèo</p>
            <p className="mt-1">Chốt kèo nhóm bạn ở Hà Nội. Bản preview, thông tin quán đang được cập nhật.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
