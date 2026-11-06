"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AREAS, PERIODS, PURPOSES, areaBySlug, directionsUrl, mapsUrl, suggestVenues, venueBySlug } from "@/lib/data";
import {
  deviceToken,
  hostTokenFor,
  loadEvent,
  lockEvent,
  saveMe,
  subscribe,
  usingSupabase,
  type EventRow,
  type Participant,
} from "@/lib/store";
import type { Pin } from "@/components/MiniMap";

const MiniMap = dynamic(() => import("@/components/MiniMap"), { ssr: false, loading: () => <div className="card h-64 animate-pulse" /> });

const WD = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const dayLabel = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return `${WD[dt.getDay()]} ${d}/${m}`;
};
const periodLabel = (p: string) => PERIODS.find((x) => x.value === p)?.label ?? p;
const slotLabel = (slot: string) => {
  const [d, p] = slot.split("|");
  return `${periodLabel(p)} ${dayLabel(d)}`;
};
// Buổi đã qua: ngày trước hôm nay, hoặc hôm nay nhưng buổi đã kết thúc
const PERIOD_END_HOUR: Record<string, number> = { trua: 14, chieu: 17, toi: 24 };
const isPastSlot = (slot: string) => {
  const [d, p] = slot.split("|");
  const [y, m, day] = d.split("-").map(Number);
  const end = new Date(y, m - 1, day, PERIOD_END_HOUR[p] ?? 24, 0, 0);
  return end.getTime() <= Date.now();
};
const PERIOD_TIME: Record<string, [string, string]> = { trua: ["113000", "133000"], chieu: ["150000", "170000"], toi: ["190000", "213000"] };

type Tab = "gio" | "quan" | "ai";

export default function Room({ code }: { code: string }) {
  const params = useSearchParams();
  const [event, setEvent] = useState<EventRow | null>(null);
  const [shown, setShown] = useState(5);
  const [people, setPeople] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [device, setDevice] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [tab, setTab] = useState<Tab>("gio");
  const [nameInput, setNameInput] = useState("");
  const [toast, setToast] = useState("");
  const [showLock, setShowLock] = useState(false);

  const refresh = useCallback(async () => {
    const r = await loadEvent(code);
    if (r) {
      setEvent(r.event);
      setPeople(r.participants);
    }
    setLoading(false);
  }, [code]);

  useEffect(() => {
    setDevice(deviceToken());
    setIsHost(!!hostTokenFor(code));
    refresh();
  }, [code, refresh]);

  useEffect(() => {
    if (!event) return;
    return subscribe(code, event.id, refresh);
  }, [code, event?.id, refresh]); // eslint-disable-line react-hooks/exhaustive-deps

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2200);
  };

  const me = people.find((p) => p.device_token === device);
  const link = typeof window !== "undefined" ? `${window.location.origin}/k/${code}` : "";

  // ---- tính toán ----
  const slots = useMemo(() => (event ? event.dates.flatMap((d) => PERIODS.map((p) => `${d}|${p.value}`)) : []), [event]);
  const slotCount = (s: string) => people.filter((p) => p.slots.includes(s)).length;
  const bestSlot = useMemo(() => {
    let best = "";
    let n = 0;
    slots.forEach((s) => {
      if (isPastSlot(s)) return;
      const c = people.filter((p) => p.slots.includes(s)).length;
      if (c > n) {
        n = c;
        best = s;
      }
    });
    return best;
  }, [slots, people]);

  const origins = people.map((p) => p.area).filter(Boolean) as string[];
  const { mid, list: suggestions } = useMemo(
    () => suggestVenues(origins, event?.purpose ?? "an", shown, event?.seed_venue ?? undefined),
    [origins.join(","), event?.purpose, event?.seed_venue, shown] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const pins: Pin[] = useMemo(() => {
    const jit = (id: string, k: number) => ((id.charCodeAt(k) % 10) - 5) * 0.0008;
    return [
      ...people
        .filter((p) => p.area)
        .map((p) => {
          const a = areaBySlug(p.area!)!;
          return { lat: a.lat + jit(p.id, 0), lng: a.lng + jit(p.id, 1), label: `${p.name} (${a.name})`, kind: "person" as const };
        }),
      ...(origins.length ? [{ lat: mid.lat, lng: mid.lng, label: "Điểm giữa", kind: "mid" as const }] : []),
      ...suggestions.map((s) => ({ lat: s.venue.lat, lng: s.venue.lng, label: s.venue.name, kind: "venue" as const })),
    ];
  }, [people, mid, suggestions, origins.length]);
  const voteCount = (slug: string) => people.filter((p) => p.votes.includes(slug)).length;
  const topVenue = [...suggestions].sort((a, b) => voteCount(b.venue.slug) - voteCount(a.venue.slug))[0]?.venue;

  const responded = people.filter((p) => p.slots.length || p.votes.length);
  const notVoted = people.filter((p) => !p.votes.length).map((p) => p.name);
  const missingNames = event ? event.names.filter((n) => !people.some((p) => p.name === n)) : [];
  const total = event?.expected_count || Math.max(people.length, 1);

  // ---- hành động ----
  async function join(name: string) {
    if (!event || !name.trim()) return;
    await saveMe(code, event.id, { name: name.trim() });
    await refresh();
  }
  async function toggleSlot(s: string) {
    if (!event || !me || event.status === "locked") return;
    const next = me.slots.includes(s) ? me.slots.filter((x) => x !== s) : [...me.slots, s];
    setPeople((ps) => ps.map((p) => (p.id === me.id ? { ...p, slots: next } : p)));
    await saveMe(code, event.id, { slots: next });
  }
  async function setArea(a: string) {
    if (!event || !me) return;
    setPeople((ps) => ps.map((p) => (p.id === me.id ? { ...p, area: a } : p)));
    await saveMe(code, event.id, { area: a });
  }
  async function toggleVote(slug: string) {
    if (!event || !me || event.status === "locked") return;
    const next = me.votes.includes(slug) ? me.votes.filter((x) => x !== slug) : [...me.votes, slug];
    setPeople((ps) => ps.map((p) => (p.id === me.id ? { ...p, votes: next } : p)));
    await saveMe(code, event.id, { votes: next });
  }
  async function share() {
    const text = `Lên kèo "${event?.title}" nè! Vào chọn giờ rảnh và vote quán nha 👉 ${link}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: event?.title, text, url: link });
        return;
      } catch {}
    }
    await navigator.clipboard.writeText(text);
    flash("Đã copy lời mời, dán vào nhóm chat nhé!");
  }
  async function copyReminder() {
    const who = [...missingNames, ...notVoted];
    const tag = who.length ? who.map((n) => `@${n}`).join(" ") + " ơi, " : "Cả nhà ơi, ";
    const text = `${tag}vào chọn giờ rảnh và vote quán cho kèo "${event?.title}" nha, còn thiếu mỗi mọi người thôi 🙏 ${link}`;
    await navigator.clipboard.writeText(text);
    flash("Đã copy lời nhắc!");
  }

  if (loading)
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="sticker">⏳ Đang mở kèo…</p>
        <div className="mt-4 h-9 w-2/3 animate-pulse rounded-2xl bg-line" />
        <div className="card mt-5 h-24 animate-pulse" />
        <div className="card mt-4 h-72 animate-pulse" />
      </div>
    );
  if (!event)
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-5xl">🤔</p>
        <h1 className="mt-4 text-2xl font-bold">Không tìm thấy kèo này</h1>
        <p className="mt-2 text-muted">
          {usingSupabase() ? "Link có thể bị sai." : "Bản preview đang lưu kèo trên trình duyệt, nên chỉ mở được trên máy đã tạo kèo."}
        </p>
        <Link href="/tao-keo" className="btn-primary mt-6">
          Tạo kèo mới
        </Link>
      </div>
    );

  const purposeLabel = PURPOSES.find((p) => p.value === event.purpose)?.label;

  // ---------- đã chốt ----------
  if (event.status === "locked" && event.final_venue && event.final_slot) {
    const v = venueBySlug(event.final_venue)!;
    const [d, p] = event.final_slot.split("|");
    const [st, en] = PERIOD_TIME[p] ?? ["190000", "210000"];
    const ymd = d.replaceAll("-", "");
    const cal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${ymd}T${st}/${ymd}T${en}&ctz=Asia/Ho_Chi_Minh&location=${encodeURIComponent(`${v.name}, ${v.address}, Hà Nội`)}&details=${encodeURIComponent(link)}`;
    const maps = directionsUrl(v);
    const going = people.filter((x) => x.slots.includes(event.final_slot!));
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <div className="overflow-hidden rounded-[2rem] border-2 border-ink bg-sun p-1.5 shadow-[6px_6px_0_0_var(--ink)]">
          <div className="rounded-[1.6rem] border-2 border-ink bg-card p-7">
            <p className="sticker">🎉 Chốt kèo rồi nha!</p>
            <h1 className="mt-4 text-3xl font-extrabold">{event.title}</h1>
            <p className="mt-5 text-sm text-muted">Khi nào</p>
            <p className="text-2xl font-bold text-brand">{slotLabel(event.final_slot)}</p>
            <p className="mt-4 text-sm text-muted">Ở đâu</p>
            <p className="text-xl font-bold">{v.name}</p>
            <p className="text-muted">{v.address}</p>
            <p className="mt-4 text-sm text-muted">Ai đi ({going.length})</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {(going.length ? going : people).map((x) => (
                <span key={x.id} className="chip">
                  {x.name}
                </span>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <a href={maps} target="_blank" rel="noopener" className="btn-ghost">
                📍 Chỉ đường
              </a>
              <a href={cal} target="_blank" rel="noopener" className="btn-ghost">
                📅 Thêm lịch
              </a>
            </div>
            <button onClick={share} className="btn-primary mt-3 w-full">
              Gửi vào nhóm chat
            </button>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted">
          <Link href="/tao-keo" className="font-semibold text-brand">
            Lên kèo mới →
          </Link>
        </p>
        {toast && <Toast text={toast} />}
      </div>
    );
  }

  // ---------- chưa tham gia ----------
  if (!me) {
    const taken = new Set(people.map((p) => p.name));
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <div className="card p-7">
          <p className="chip">Bạn được mời vào kèo</p>
          <h1 className="mt-3 text-3xl font-extrabold">{event.title}</h1>
          <p className="mt-1 text-muted">
            {purposeLabel} · {event.dates.map(dayLabel).join(", ")}
          </p>
          {event.names.length > 0 && (
            <>
              <p className="mt-6 font-semibold">Bạn là ai?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {event.names.map((n) => (
                  <button key={n} disabled={taken.has(n)} onClick={() => join(n)} className="btn-ghost disabled:opacity-40">
                    {n}
                    {taken.has(n) ? " ✓" : ""}
                  </button>
                ))}
              </div>
              <p className="mt-5 text-sm text-muted">Không có tên bạn?</p>
            </>
          )}
          <div className="mt-3 flex gap-2">
            <input className="input" placeholder="Nhập tên bạn" value={nameInput} onChange={(e) => setNameInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && join(nameInput)} />
            <button className="btn-primary" onClick={() => join(nameInput)} disabled={!nameInput.trim()}>
              Vào
            </button>
          </div>
          <p className="mt-4 text-xs text-muted">Không cần tài khoản. Lần sau mở lại link, máy này sẽ tự nhớ bạn.</p>
        </div>
      </div>
    );
  }

  // ---------- phòng kèo ----------
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 pb-32">
      {params.get("moi") && isHost && (
        <div className="mb-5 rounded-3xl bg-brand p-5 text-white">
          <p className="text-lg font-bold">🎉 Kèo đã tạo! Gửi link cho cả nhóm nào</p>
          <div className="mt-3 flex gap-2">
            <input readOnly value={link} className="w-full rounded-2xl bg-white/20 px-4 py-3 text-sm text-white" />
            <button onClick={share} className="rounded-2xl bg-white px-4 font-semibold text-brand">
              Gửi
            </button>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand">{purposeLabel}</p>
          <h1 className="text-3xl font-extrabold">{event.title}</h1>
          <p className="mt-1 text-sm text-muted">Chào {me.name} 👋{isHost ? " · Bạn là chủ kèo" : ""}</p>
        </div>
        <button onClick={share} className="btn-ghost shrink-0 !px-4 !py-2 text-sm">
          🔗 Mời
        </button>
      </div>

      <div className="card mt-5 p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">
            {responded.length}/{total} người đã trả lời
          </span>
          <button onClick={copyReminder} className="font-semibold text-brand">
            Copy lời nhắc
          </button>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${Math.min(100, (responded.length / total) * 100)}%` }} />
        </div>
        {(missingNames.length > 0 || notVoted.length > 0) && (
          <p className="mt-2 text-xs text-muted">
            {missingNames.length > 0 && <>Chưa vào kèo: {missingNames.join(", ")}. </>}
            {notVoted.length > 0 && <>Chưa vote: {notVoted.join(", ")}.</>}
          </p>
        )}
      </div>

      <div className="sticky top-[57px] z-10 mt-5 flex gap-1 rounded-full border border-line bg-bg/95 p-1 backdrop-blur">
        {([
          ["gio", "🕒 Giờ"],
          ["quan", "📍 Quán"],
          ["ai", `👥 Ai đi (${people.length})`],
        ] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`flex-1 rounded-full py-2 text-sm font-semibold ${tab === k ? "bg-brand text-white" : ""}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === "gio" && (
        <section className="mt-5">
          <p className="text-sm text-muted">Bấm vào các buổi bạn rảnh. Số trong ô là số người rảnh.</p>
          <div className="card mt-3 overflow-x-auto p-3">
            <table className="w-full border-separate border-spacing-1.5 text-sm">
              <thead>
                <tr>
                  <th />
                  {PERIODS.map((p) => (
                    <th key={p.value} className="font-semibold text-muted">
                      {p.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {event.dates.map((d) => (
                  <tr key={d}>
                    <td className="whitespace-nowrap pr-2 font-semibold">{dayLabel(d)}</td>
                    {PERIODS.map((p) => {
                      const s = `${d}|${p.value}`;
                      const mine = me.slots.includes(s);
                      const c = slotCount(s);
                      const heat = people.length ? c / people.length : 0;
                      const past = isPastSlot(s);
                      return (
                        <td key={s}>
                          <button
                            onClick={() => !past && toggleSlot(s)}
                            disabled={past}
                            title={past ? "Buổi này đã qua" : undefined}
                            className={`h-14 w-full rounded-2xl border-2 font-extrabold transition ${past ? "cursor-not-allowed border-dashed border-line opacity-40" : mine ? "border-ink shadow-[2px_2px_0_0_var(--ink)]" : "border-transparent hover:border-ink"} ${s === bestSlot ? "ring-2 ring-lime ring-offset-2" : ""}`}
                            style={past ? { background: "transparent" } : { background: `rgba(255,90,31,${0.08 + heat * 0.8})`, color: heat > 0.5 ? "white" : undefined }}
                          >
                            {past ? "–" : c || ""}
                            {mine && !past && <span className="pop ml-1 text-xs">✓</span>}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {bestSlot && (
            <p className="mt-3 rounded-2xl border-2 border-ink bg-lime-soft px-4 py-3 text-sm">
              ⭐ Nhiều người rảnh nhất: <b>{slotLabel(bestSlot)}</b> ({slotCount(bestSlot)} người)
            </p>
          )}
          <button className="btn-primary mt-5 w-full" onClick={() => setTab("quan")}>
            Tiếp: chọn quán →
          </button>
        </section>
      )}

      {tab === "quan" && (
        <section className="mt-5 space-y-4">
          <div className="card p-4">
            <label className="text-sm font-semibold">Bạn đi từ khu nào?</label>
            <select className="input mt-2" value={me.area ?? ""} onChange={(e) => setArea(e.target.value)}>
              <option value="" disabled>
                Chọn quận
              </option>
              {AREAS.map((a) => (
                <option key={a.slug} value={a.slug}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <MiniMap pins={pins} />
          <p className="text-xs text-muted">🔵 Mọi người · ⚫ Điểm giữa · 🟠 Quán gợi ý. Có thể vote nhiều quán.</p>
          <div className="space-y-3">
            {suggestions.map(({ venue: v, km }) => {
              const voted = me.votes.includes(v.slug);
              const voters = people.filter((p) => p.votes.includes(v.slug));
              return (
                <div key={v.slug} className={`card flex items-center gap-4 p-4 ${voted ? "!border-brand" : ""}`}>
                  <div className="min-w-0 flex-1">
                    <Link href={`/q/${v.slug}`} target="_blank" className="font-bold hover:text-brand">
                      {v.kind === "an" ? "🍲" : "☕"} {v.name}
                    </Link>
                    <p className="truncate text-sm text-muted">
                      {v.address} · cách điểm giữa {km.toFixed(1)} km
                    </p>
                    <a href={mapsUrl(v)} target="_blank" rel="noopener" className="mt-1 inline-block text-xs font-bold text-brand underline">
                      📍 Xem trên Google Maps
                    </a>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {v.price && <span className="chip">{v.price}</span>}
                      {event.seed_venue === v.slug && <span className="chip">Chủ kèo đề xuất</span>}
                      {voters.length > 0 && <span className="text-xs text-muted">{voters.map((x) => x.name).join(", ")}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleVote(v.slug)}
                    className={`flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl font-bold transition ${voted ? "bg-brand text-white" : "bg-brand-soft"}`}
                  >
                    <span className="text-lg leading-none">{voted ? "♥" : "♡"}</span>
                    <span className="text-xs">{voters.length}</span>
                  </button>
                </div>
              );
            })}
            {suggestions.length >= shown && shown < 30 && (
              <button className="btn-ghost w-full" onClick={() => setShown((n) => n + 5)}>
                👀 Xem thêm quán
              </button>
            )}
          </div>
        </section>
      )}

      {tab === "ai" && (
        <section className="mt-5 space-y-2">
          {people.map((p) => (
            <div key={p.id} className="card flex items-center justify-between p-4">
              <div>
                <p className="font-semibold">
                  {p.name}
                  {p.id === me.id ? " (bạn)" : ""}
                </p>
                <p className="text-xs text-muted">
                  {p.area ? `Từ ${areaBySlug(p.area)?.name}` : "Chưa chọn khu"} · {p.slots.length} buổi rảnh · {p.votes.length} vote
                </p>
              </div>
              <span className="text-xl">{p.slots.length && p.votes.length ? "✅" : "⏳"}</span>
            </div>
          ))}
          {missingNames.map((n) => (
            <div key={n} className="card flex items-center justify-between p-4 opacity-60">
              <p className="font-semibold">{n}</p>
              <span className="text-xs">Chưa mở link</span>
            </div>
          ))}
        </section>
      )}

      {isHost && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/95 p-3 backdrop-blur">
          <div className="mx-auto max-w-3xl">
            {!showLock ? (
              <button className="btn-primary w-full" onClick={() => setShowLock(true)} disabled={!bestSlot || !topVenue}>
                {bestSlot && topVenue ? "🔒 Chốt kèo" : "Cần ít nhất 1 buổi rảnh để chốt"}
              </button>
            ) : (
              <LockPanel
                slots={slots.filter((s) => slotCount(s) > 0).sort((a, b) => slotCount(b) - slotCount(a))}
                venues={suggestions.map((s) => s.venue.slug).sort((a, b) => voteCount(b) - voteCount(a))}
                defaultSlot={bestSlot}
                defaultVenue={topVenue?.slug ?? ""}
                slotCount={slotCount}
                voteCount={voteCount}
                onCancel={() => setShowLock(false)}
                onLock={async (s, v) => {
                  await lockEvent(code, v, s);
                  await refresh();
                }}
              />
            )}
          </div>
        </div>
      )}
      {toast && <Toast text={toast} />}
    </div>
  );
}

function LockPanel(props: {
  slots: string[];
  venues: string[];
  defaultSlot: string;
  defaultVenue: string;
  slotCount: (s: string) => number;
  voteCount: (v: string) => number;
  onCancel: () => void;
  onLock: (slot: string, venue: string) => Promise<void>;
}) {
  const [s, setS] = useState(props.defaultSlot);
  const [v, setV] = useState(props.defaultVenue);
  const [busy, setBusy] = useState(false);
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <select className="input !py-2 text-sm" value={s} onChange={(e) => setS(e.target.value)}>
          {props.slots.map((x) => (
            <option key={x} value={x}>
              {slotLabel(x)} ({props.slotCount(x)} rảnh)
            </option>
          ))}
        </select>
        <select className="input !py-2 text-sm" value={v} onChange={(e) => setV(e.target.value)}>
          {props.venues.map((x) => (
            <option key={x} value={x}>
              {venueBySlug(x)?.name} ({props.voteCount(x)} vote)
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button className="btn-ghost" onClick={props.onCancel}>
          Huỷ
        </button>
        <button
          className="btn-primary flex-1"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            await props.onLock(s, v);
          }}
        >
          {busy ? "Đang chốt…" : "Chốt luôn ✅"}
        </button>
      </div>
    </div>
  );
}

function Toast({ text }: { text: string }) {
  return <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-bg shadow-lg">{text}</div>;
}
