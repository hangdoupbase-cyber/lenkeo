# Lên Kèo

Web chốt kèo nhóm bạn ở Hà Nội: tạo kèo, gửi link, cả nhóm chọn giờ rảnh, chọn khu xuất phát, vote quán ở khoảng giữa và chốt.

Stack: Next.js (App Router) + Tailwind trên Vercel, Supabase (database + realtime), Sanity (CMS, sẽ thêm sau), bản đồ OpenStreetMap + Leaflet.

## Chạy thử trên máy

```bash
npm install
cp .env.example .env.local   # điền khoá Supabase nếu có
npm run dev
```

Chưa có Supabase thì kèo được lưu tạm trong trình duyệt (chỉ cùng một máy).

## Bật Supabase

1. Supabase → SQL Editor → New query → dán nội dung `supabase/schema.sql` → Run.
2. Trên Vercel → Project → Settings → Environment Variables, thêm:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (ví dụ `https://lenkeo.vercel.app`)
3. Redeploy.

## Cấu trúc

- `src/lib/data.ts`: dữ liệu quán và khu vực tạm (sẽ chuyển sang Sanity)
- `src/lib/store.ts`: lưu kèo (Supabase hoặc localStorage)
- `src/app/k/[code]`: phòng kèo
- `src/app/tao-keo`: tạo kèo 3 bước
- `src/app/quan`, `src/app/q/[slug]`: trang quán cho SEO
