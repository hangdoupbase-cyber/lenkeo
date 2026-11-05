"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PURPOSES, venueBySlug, type Purpose } from "@/lib/data";
import { createEvent } from "@/lib/store";

const WD = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

function nextDays(n: number) {
  const out: { iso: string; label: string; wd: string }[] = [];
  const d = new Date();
  for (let i = 0; i < n; i++) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    const iso = `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, "0")}-${String(x.getDate()).padStart(2, "0")}`;
    out.push({ iso, label: `${x.getDate()}/${x.getMonth() + 1}`, wd: i === 0 ? "Hôm nay" : WD[x.getDay()] });
  }
  return out;
}

export default function CreateForm() {
  const router = useRouter();
  const params = useSearchParams();
  const seed = params.get("quan");
  const seedVenue = seed ? venueBySlug(seed) : undefined;
  const days = useMemo(() => nextDays(14), []);

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState(seedVenue ? `Kèo ở ${seedVenue.name}` : "");
  const [purpose, setPurpose] = useState<Purpose>(seedVenue?.kind === "cafe" ? "cafe" : "an");
  const [dates, setDates] = useState<string[]>([]);
  const [host, setHost] = useState("");
  const [mode, setMode] = useState<"skip" | "count" | "names">("skip");
  const [count, setCount] = useState("");
  const [names, setNames] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const toggleDate = (iso: string) =>
    setDates((s) => (s.includes(iso) ? s.filter((x) => x !== iso) : s.length >= 5 ? s : [...s, iso].sort()));

  async function submit() {
    setBusy(true);
    setErr("");
    try {
      const nameList =
        mode === "names"
          ? Array.from(new Set(names.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean)))
          : [];
      if (mode === "names" && host.trim() && !nameList.includes(host.trim())) nameList.unshift(host.trim());
      const code = await createEvent({
        title: title.trim() || "Kèo mới",
        purpose,
        dates,
        expected_count: mode === "count" ? Number(count) || null : mode === "names" ? nameList.length : null,
        names: nameList,
        seed_venue: seedVenue?.slug ?? null,
        host_name: host.trim() || "Chủ kèo",
      });
      router.push(`/k/${code}?moi=1`);
    } catch (e) {
      console.error(e);
      setErr("Chưa tạo được kèo, bạn thử lại nhé.");
      setBusy(false);
    }
  }

  return (
    <div className="card p-6 sm:p-8">
      <div className="mb-6 flex gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-brand" : "bg-line"}`} />
        ))}
      </div>

      {seedVenue && (
        <p className="mb-5 rounded-2xl bg-brand-soft px-4 py-3 text-sm">
          📍 <b>{seedVenue.name}</b> sẽ được đưa sẵn vào danh sách vote.
        </p>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold">Kèo gì đây?</h2>
          <input className="input text-lg" placeholder="VD: Họp lớp 12A1, Sinh nhật Linh…" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          <div className="grid grid-cols-3 gap-2">
            {PURPOSES.map((p) => (
              <button
                key={p.value}
                onClick={() => setPurpose(p.value)}
                className={`rounded-2xl border px-3 py-4 text-sm font-semibold ${purpose === p.value ? "border-brand bg-brand-soft" : "border-line"}`}
              >
                <span className="block text-2xl">{p.value === "an" ? "🍲" : p.value === "cafe" ? "☕" : "🍲☕"}</span>
                {p.label}
              </button>
            ))}
          </div>
          <button className="btn-primary w-full" onClick={() => setStep(2)}>
            Tiếp →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold">Những ngày có thể đi?</h2>
          <p className="text-sm text-muted">Chọn tối đa 5 ngày, mọi người sẽ tick buổi rảnh trong các ngày này.</p>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
            {days.map((d) => (
              <button
                key={d.iso}
                onClick={() => toggleDate(d.iso)}
                className={`rounded-2xl border px-2 py-3 text-center ${dates.includes(d.iso) ? "border-brand bg-brand text-white" : "border-line"}`}
              >
                <span className="block text-xs opacity-80">{d.wd}</span>
                <span className="font-bold">{d.label}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button className="btn-ghost" onClick={() => setStep(1)}>
              ←
            </button>
            <button className="btn-primary flex-1" disabled={!dates.length} onClick={() => setStep(3)}>
              {dates.length ? `Tiếp (${dates.length} ngày) →` : "Chọn ít nhất 1 ngày"}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold">Bạn tên gì?</h2>
          <input className="input text-lg" placeholder="Tên bạn trong nhóm" value={host} onChange={(e) => setHost(e.target.value)} autoFocus />
          <div>
            <p className="font-semibold">Thành viên nhóm (không bắt buộc)</p>
            <p className="text-sm text-muted">Để web biết ai còn thiếu mà nhắc.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {([
                ["skip", "Bỏ qua"],
                ["count", "Chỉ nhập số người"],
                ["names", "Dán danh sách tên"],
              ] as const).map(([k, l]) => (
                <button
                  key={k}
                  onClick={() => setMode(k)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${mode === k ? "bg-brand text-white" : "bg-brand-soft"}`}
                >
                  {l}
                </button>
              ))}
            </div>
            {mode === "count" && (
              <input className="input mt-3" type="number" min={2} max={50} placeholder="VD: 8" value={count} onChange={(e) => setCount(e.target.value)} />
            )}
            {mode === "names" && (
              <textarea
                className="input mt-3 min-h-28"
                placeholder={"Mỗi dòng một tên, hoặc cách nhau bằng dấu phẩy\nVD: Linh, Huy, Mai, Hùng"}
                value={names}
                onChange={(e) => setNames(e.target.value)}
              />
            )}
          </div>
          {err && <p className="text-sm font-semibold text-red-600">{err}</p>}
          <div className="flex gap-3">
            <button className="btn-ghost" onClick={() => setStep(2)}>
              ←
            </button>
            <button className="btn-primary flex-1" disabled={busy || !host.trim()} onClick={submit}>
              {busy ? "Đang tạo…" : "Tạo kèo & lấy link 🎉"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
