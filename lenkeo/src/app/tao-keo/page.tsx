import type { Metadata } from "next";
import { Suspense } from "react";
import CreateForm from "./CreateForm";

export const metadata: Metadata = {
  title: "Tạo kèo hẹn nhóm bạn miễn phí",
  description:
    "Tạo kèo trong 30 giây: đặt tên, chọn ngày, gửi link vào nhóm chat. Cả nhóm chọn giờ rảnh và vote quán ở khoảng giữa.",
  alternates: { canonical: "/tao-keo" },
};

export default function TaoKeoPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Tạo kèo mới</h1>
      <p className="mt-2 text-muted">3 bước, chưa tới 1 phút. Không cần đăng ký.</p>
      <div className="mt-6">
        <Suspense fallback={<div className="card h-80 animate-pulse" />}>
          <CreateForm />
        </Suspense>
      </div>
    </div>
  );
}
