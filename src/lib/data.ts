// Dữ liệu tạm cho bản preview. Sẽ chuyển sang Sanity sau.
// Toạ độ là gần đúng theo tên phố, cần kiểm tra lại khi nhập vào Sanity.

export type Kind = "an" | "cafe";

export type Area = {
  slug: string;
  name: string;
  lat: number;
  lng: number;
  intro: string;
};

export type Venue = {
  slug: string;
  name: string;
  area: string; // area slug
  kind: Kind;
  category: string;
  address: string;
  price?: string;
  hours?: string;
  why: string;
  tags: string[];
  lat: number;
  lng: number;
  source: string;
};

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://lenkeo.vercel.app";

export const AREAS: Area[] = [
  { slug: "hoan-kiem", name: "Hoàn Kiếm", lat: 21.0288, lng: 105.8525, intro: "Phố cổ, Hồ Gươm và cầu Long Biên: nơi có nhiều quán cà phê view đẹp và quán lẩu nướng giá sinh viên, rất hợp hẹn nhóm buổi tối." },
  { slug: "ba-dinh", name: "Ba Đình", lat: 21.0358, lng: 105.827, intro: "Quanh Trúc Bạch, Quán Thánh và Giảng Võ có nhiều quán ăn đêm, lẩu nướng và cà phê chill cho nhóm bạn." },
  { slug: "dong-da", name: "Đống Đa", lat: 21.015, lng: 105.825, intro: "Hoàng Cầu, Thái Hà, Tây Sơn là các tuyến phố ăn uống sầm uất, nhiều quán rộng cho nhóm đông và rooftop cà phê." },
  { slug: "tay-ho", name: "Tây Hồ", lat: 21.07, lng: 105.818, intro: "Cà phê ven Hồ Tây, quán bia và nhà hàng thoáng đãng cho buổi hẹn cuối tuần." },
  { slug: "long-bien", name: "Long Biên", lat: 21.045, lng: 105.89, intro: "Khu vực bên kia sông Hồng, quán rộng, dễ đỗ xe cho nhóm đông." },
  { slug: "cau-giay", name: "Cầu Giấy", lat: 21.033, lng: 105.794, intro: "Khu sinh viên và văn phòng, nhiều quán lẩu nướng buffet và cà phê làm việc." },
  { slug: "hai-ba-trung", name: "Hai Bà Trưng", lat: 21.006, lng: 105.858, intro: "Phố Huế, Đại Cồ Việt, Lò Đúc: nhiều quán nướng, quán nhậu và cà phê rooftop." },
  { slug: "hoang-mai", name: "Hoàng Mai", lat: 20.976, lng: 105.855, intro: "Quán rộng, giá mềm, hợp nhóm đông ở phía nam thành phố." },
  { slug: "thanh-xuan", name: "Thanh Xuân", lat: 20.995, lng: 105.81, intro: "Royal City, Ngụy Như Kon Tum và Nguyễn Trãi: nhiều buffet và rooftop cho giới trẻ." },
  { slug: "nam-tu-liem", name: "Nam Từ Liêm", lat: 21.015, lng: 105.765, intro: "Mỹ Đình, Keangnam: nhiều nhà hàng mới, rộng rãi." },
  { slug: "bac-tu-liem", name: "Bắc Từ Liêm", lat: 21.07, lng: 105.765, intro: "Khu đô thị mới, quán rộng, dễ đỗ xe." },
  { slug: "ha-dong", name: "Hà Đông", lat: 20.96, lng: 105.765, intro: "Phía tây nam thành phố, nhiều quán ăn giá tốt cho nhóm." },
];

export const VENUES: Venue[] = [
  { slug: "lau-hit-nguyen-tu-gian", name: "Lẩu Hít", area: "hoan-kiem", kind: "an", category: "Lẩu", address: "1 Nguyễn Tư Giản, Hoàn Kiếm", price: "~160k/người", why: "Có review nhóm 7 người ăn no, giá vừa túi.", tags: ["Giá sinh viên", "Nhóm đông"], lat: 21.0395, lng: 105.8545, source: "Foody" },
  { slug: "co-quynh-lau-nuong", name: "Cô Quỳnh – Lẩu & Nướng", area: "hoan-kiem", kind: "an", category: "Buffet nướng", address: "20 Gầm Cầu, Hoàn Kiếm", price: "139k/người", hours: "10h–23h", why: "Hay được chọn đi sinh nhật, buffet tự lấy đồ.", tags: ["Buffet", "Sinh nhật"], lat: 21.039, lng: 105.848, source: "Foody" },
  { slug: "lau-thang-beo", name: "Lẩu Thắng Béo", area: "hoan-kiem", kind: "an", category: "Lẩu", address: "3B ngõ Cấm Chỉ, 202 Hàng Bông, Hoàn Kiếm", why: "Hợp tụ tập nhóm, sinh nhật; ngay phố cổ.", tags: ["Nhóm đông", "Phố cổ"], lat: 21.031, lng: 105.847, source: "Mytour" },
  { slug: "cong-ca-phe-cau-go", name: "Cộng Cà Phê Cầu Gỗ", area: "hoan-kiem", kind: "cafe", category: "Cà phê", address: "116 Cầu Gỗ, Hoàn Kiếm", price: "20–100k", hours: "7h30–23h", why: "View Hồ Gươm, chụp ảnh nhóm đẹp.", tags: ["View hồ", "Mở muộn"], lat: 21.033, lng: 105.853, source: "Vinpearl" },
  { slug: "cafe-pho-co-hang-gai", name: "Cafe Phố Cổ", area: "hoan-kiem", kind: "cafe", category: "Cà phê", address: "11 Hàng Gai, Hoàn Kiếm", hours: "8h–23h", why: "Ngắm Hồ Gươm từ trên cao.", tags: ["View hồ", "Cà phê trứng"], lat: 21.0325, lng: 105.8505, source: "Vinpearl" },
  { slug: "serein-cafe", name: "Serein Cafe", area: "hoan-kiem", kind: "cafe", category: "Cà phê", address: "16 khu tập thể Ga Long Biên, Hoàn Kiếm", price: "35–60k", hours: "9h–23h", why: "Ban công view cầu Long Biên, hợp team sống ảo.", tags: ["Check-in", "View cầu"], lat: 21.0405, lng: 105.849, source: "Mytour" },
  { slug: "cafe-so-2-dinh-liet", name: "Cafe số 2 Đinh Liệt (Ban Công)", area: "hoan-kiem", kind: "cafe", category: "Cà phê", address: "2 Đinh Liệt, Hoàn Kiếm", price: "40–100k", hours: "7h30–23h", why: "Decor vintage, ban công nhìn phố cổ.", tags: ["Vintage", "Ban công"], lat: 21.032, lng: 105.8525, source: "Vinpearl" },
  { slug: "the-note-coffee", name: "The Note Coffee", area: "hoan-kiem", kind: "cafe", category: "Cà phê", address: "64 Lương Văn Can, Hoàn Kiếm", price: "30–55k", hours: "8h–22h30", why: "Tường giấy note nổi tiếng, gần Hồ Gươm.", tags: ["Check-in"], lat: 21.032, lng: 105.851, source: "Vinpearl" },
  { slug: "xofa-cafe-bistro", name: "Xofa Café & Bistro", area: "hoan-kiem", kind: "cafe", category: "Cà phê + bistro", address: "14 Tống Duy Tân, Hoàn Kiếm", why: "Decor cổ điển đổi theo mùa, có món ăn, ngồi buổi tối.", tags: ["Có đồ ăn", "Mở muộn"], lat: 21.0295, lng: 105.8445, source: "MIA.vn" },
  { slug: "lau-duc-troc-tran-huy-lieu", name: "Lẩu Đức Trọc", area: "ba-dinh", kind: "an", category: "Lẩu", address: "101 D1 Trần Huy Liệu, Ba Đình", price: "150–170k/người", why: "Chuỗi lẩu quen thuộc, nhiều món nhậu.", tags: ["Nhóm đông", "Món nhậu"], lat: 21.028, lng: 105.817, source: "Mytour" },
  { slug: "nuong-ngoi-lau-thai-hang-bun", name: "Nướng Ngói Lẩu Thái", area: "ba-dinh", kind: "an", category: "Nướng + lẩu", address: "15 Hàng Bún, Ba Đình", hours: "Mở khuya", why: "Ăn đêm, gần Trúc Bạch.", tags: ["Ăn đêm"], lat: 21.044, lng: 105.843, source: "Mytour" },
  { slug: "lau-nuong-gia-bach", name: "Lẩu Nướng Gia Bách", area: "ba-dinh", kind: "an", category: "Lẩu nướng", address: "14 Thành Công, Ba Đình", hours: "Mở khuya", why: "Ăn đêm cho nhóm.", tags: ["Ăn đêm"], lat: 21.02, lng: 105.815, source: "Mytour" },
  { slug: "lau-hai-san-hang-beo", name: "Lẩu hải sản Hằng Béo", area: "ba-dinh", kind: "an", category: "Lẩu hải sản", address: "Phố Trần Phú, Ba Đình", price: "Nồi từ 250k", why: "Nồi hải sản đầy đặn cho nhóm.", tags: ["Hải sản"], lat: 21.032, lng: 105.842, source: "Znews" },
  { slug: "song-sanh-cafe", name: "Sóng Sánh Café", area: "ba-dinh", kind: "cafe", category: "Cà phê", address: "48 Ngọc Hà, Ba Đình", why: "Không gian chill, dễ ngồi lâu.", tags: ["Chill"], lat: 21.038, lng: 105.829, source: "GreenSM" },
  { slug: "daily-dose-coffee", name: "Daily Dose Coffee", area: "ba-dinh", kind: "cafe", category: "Cà phê", address: "18 Lê Trực, Ba Đình", hours: "7h–22h", why: "Gần trung tâm, hợp hẹn nhanh.", tags: ["Specialty"], lat: 21.031, lng: 105.838, source: "GreenSM" },
  { slug: "thai-yen-cafe", name: "Thái Yên Cafe", area: "ba-dinh", kind: "cafe", category: "Cà phê", address: "184 Quán Thánh, Ba Đình", hours: "7h30–22h", why: "Không gian chill giữa phố Quán Thánh.", tags: ["Chill"], lat: 21.042, lng: 105.841, source: "GreenSM" },
  { slug: "ham-tru-an", name: "Hầm Trú Ẩn", area: "ba-dinh", kind: "cafe", category: "Cà phê", address: "18B Nguyễn Biểu, Ba Đình", hours: "8h–22h", why: "Decor Hà Nội xưa, hợp ngồi làm việc cùng nhau.", tags: ["Làm việc", "Vintage"], lat: 21.042, lng: 105.844, source: "MIA.vn" },
  { slug: "hem-quan-hoang-cau", name: "Hẻm Quán", area: "dong-da", kind: "an", category: "Món Nam bộ, lẩu", address: "Phố Hoàng Cầu, Đống Đa", price: "Lẩu 250–350k/nồi", why: "Rộng, có khu ngoài trời, hay tổ chức sinh nhật.", tags: ["Ngoài trời", "Sinh nhật"], lat: 21.0185, lng: 105.823, source: "Znews" },
  { slug: "tuoi-bbq-hoang-cau", name: "Tươi BBQ", area: "dong-da", kind: "an", category: "Lẩu nướng", address: "169 Hoàng Cầu, Đống Đa", hours: "10h30–14h30, 17h30–23h30", why: "Phố ăn uống Hoàng Cầu, mở muộn.", tags: ["Mở muộn", "Nướng"], lat: 21.018, lng: 105.8225, source: "Vinpearl" },
  { slug: "quan-moc-thai-ha", name: "Quán Mộc", area: "dong-da", kind: "an", category: "Lẩu, món Việt", address: "39 ngõ 165 Thái Hà, Đống Đa", price: "150–180k/người", why: "Set lẩu cho nhóm, không gian ấm cúng.", tags: ["Set nhóm"], lat: 21.013, lng: 105.82, source: "Mytour" },
  { slug: "sam-rooftop-coffee", name: "Sam Rooftop Coffee", area: "dong-da", kind: "cafe", category: "Cà phê rooftop", address: "Tầng 8–9, 58/298 Tây Sơn, Đống Đa", price: "45–60k", hours: "8h30–23h", why: "View trên cao, đèn đẹp buổi tối.", tags: ["Rooftop", "Mở muộn"], lat: 21.006, lng: 105.823, source: "VinWonders" },
  { slug: "cest-si-bon-thai-ha", name: "C'est Si Bon", area: "dong-da", kind: "cafe", category: "Cà phê", address: "276 Thái Hà, Đống Đa", why: "Quán nổi tiếng để chụp ảnh.", tags: ["Check-in"], lat: 21.011, lng: 105.818, source: "Vinpearl" },
];

export const PURPOSES = [
  { value: "an", label: "Đi ăn" },
  { value: "cafe", label: "Đi cà phê" },
  { value: "an-cafe", label: "Ăn xong đi cà phê" },
] as const;

export type Purpose = (typeof PURPOSES)[number]["value"];

export const PERIODS = [
  { value: "trua", label: "Trưa" },
  { value: "chieu", label: "Chiều" },
  { value: "toi", label: "Tối" },
] as const;

export const areaBySlug = (slug: string) => AREAS.find((a) => a.slug === slug);
export const venueBySlug = (slug: string) => VENUES.find((v) => v.slug === slug);
export const venuesInArea = (slug: string) => VENUES.filter((v) => v.area === slug);
export const areasWithVenues = () => AREAS.filter((a) => VENUES.some((v) => v.area === a.slug));

export function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number) {
  const R = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLng = ((bLng - aLng) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

/** Gợi ý quán gần điểm giữa của các khu xuất phát. */
export function suggestVenues(originAreas: string[], purpose: Purpose, limit = 5, pinned?: string) {
  const pts = originAreas.map(areaBySlug).filter(Boolean) as Area[];
  const mid = pts.length
    ? { lat: pts.reduce((s, p) => s + p.lat, 0) / pts.length, lng: pts.reduce((s, p) => s + p.lng, 0) / pts.length }
    : { lat: 21.0288, lng: 105.8525 };
  const kinds: Kind[] = purpose === "an" ? ["an"] : purpose === "cafe" ? ["cafe"] : ["an", "cafe"];
  const ranked = VENUES.filter((v) => kinds.includes(v.kind))
    .map((v) => ({ venue: v, km: distanceKm(mid.lat, mid.lng, v.lat, v.lng) }))
    .sort((a, b) => a.km - b.km);
  let list = ranked.slice(0, limit);
  if (pinned && !list.some((r) => r.venue.slug === pinned)) {
    const p = ranked.find((r) => r.venue.slug === pinned);
    if (p) list = [p, ...list.slice(0, limit - 1)];
  }
  return { mid, list };
}
