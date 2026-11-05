import type { Metadata } from "next";
import { Suspense } from "react";
import Room from "./Room";

export const metadata: Metadata = {
  title: "Phòng kèo",
  description: "Chọn giờ rảnh và vote quán cho kèo của nhóm.",
  robots: { index: false, follow: false },
};

export default async function KeoPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-4 py-10"><div className="card h-96 animate-pulse" /></div>}>
      <Room code={code} />
    </Suspense>
  );
}
