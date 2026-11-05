"use client";

// Lớp lưu trữ kèo. Có Supabase (biến môi trường) thì dùng Supabase + Realtime;
// chưa có thì tạm lưu trong localStorage của trình duyệt (chỉ cùng một máy).

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { customAlphabet } from "nanoid";
import type { Purpose } from "./data";

export type EventRow = {
  id: string;
  code: string;
  title: string;
  purpose: Purpose;
  dates: string[];
  expected_count: number | null;
  names: string[];
  seed_venue: string | null;
  host_token: string;
  status: "open" | "locked";
  final_venue: string | null;
  final_slot: string | null;
  created_at: string;
};

export type Participant = {
  id: string;
  event_id: string;
  name: string;
  device_token: string;
  slots: string[];
  area: string | null;
  votes: string[];
  updated_at: string;
};

const makeCode = customAlphabet("abcdefghijkmnpqrstuvwxyz23456789", 8);
const makeToken = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 24);

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let sb: SupabaseClient | null = null;
if (url && key) sb = createClient(url, key);

export const usingSupabase = () => !!sb;

// ---------- thiết bị ----------
export function deviceToken() {
  let t = localStorage.getItem("lenkeo:device");
  if (!t) {
    t = makeToken();
    localStorage.setItem("lenkeo:device", t);
  }
  return t;
}
export const hostTokenFor = (code: string) => localStorage.getItem(`lenkeo:host:${code}`);

// ---------- local fallback ----------
type LocalBlob = { event: EventRow; participants: Participant[] };
const lkey = (code: string) => `lenkeo:event:${code}`;
const readLocal = (code: string): LocalBlob | null => {
  const raw = localStorage.getItem(lkey(code));
  return raw ? (JSON.parse(raw) as LocalBlob) : null;
};
const writeLocal = (code: string, blob: LocalBlob) => {
  localStorage.setItem(lkey(code), JSON.stringify(blob));
  window.dispatchEvent(new CustomEvent("lenkeo:change", { detail: code }));
};

// ---------- API ----------
export async function createEvent(input: {
  title: string;
  purpose: Purpose;
  dates: string[];
  expected_count: number | null;
  names: string[];
  seed_venue: string | null;
  host_name: string;
}): Promise<string> {
  const code = makeCode();
  const host_token = makeToken();
  const now = new Date().toISOString();
  const base = {
    code,
    title: input.title,
    purpose: input.purpose,
    dates: input.dates,
    expected_count: input.expected_count,
    names: input.names,
    seed_venue: input.seed_venue,
    host_token,
    status: "open" as const,
    final_venue: null,
    final_slot: null,
  };
  let eventId: string;
  if (sb) {
    const { data, error } = await sb.from("events").insert(base).select("id").single();
    if (error) throw error;
    eventId = data.id;
  } else {
    eventId = crypto.randomUUID();
    writeLocal(code, { event: { ...base, id: eventId, created_at: now }, participants: [] });
  }
  localStorage.setItem(`lenkeo:host:${code}`, host_token);
  await saveMe(code, eventId, { name: input.host_name });
  return code;
}

export async function loadEvent(code: string): Promise<{ event: EventRow; participants: Participant[] } | null> {
  if (sb) {
    const { data: event } = await sb.from("events").select("*").eq("code", code).maybeSingle();
    if (!event) return null;
    const { data: participants } = await sb
      .from("participants")
      .select("*")
      .eq("event_id", event.id)
      .order("updated_at");
    return { event: event as EventRow, participants: (participants || []) as Participant[] };
  }
  return readLocal(code);
}

/** Tạo hoặc cập nhật dòng của chính mình trong kèo. */
export async function saveMe(
  code: string,
  eventId: string,
  patch: Partial<Pick<Participant, "name" | "slots" | "area" | "votes">>
) {
  const device = deviceToken();
  const now = new Date().toISOString();
  if (sb) {
    const { data: existing } = await sb
      .from("participants")
      .select("id")
      .eq("event_id", eventId)
      .eq("device_token", device)
      .maybeSingle();
    if (existing) {
      await sb.from("participants").update({ ...patch, updated_at: now }).eq("id", existing.id);
    } else {
      await sb.from("participants").insert({
        event_id: eventId,
        device_token: device,
        name: patch.name || "Ẩn danh",
        slots: patch.slots || [],
        area: patch.area || null,
        votes: patch.votes || [],
        updated_at: now,
      });
    }
    return;
  }
  const blob = readLocal(code);
  if (!blob) return;
  const i = blob.participants.findIndex((p) => p.device_token === device);
  if (i >= 0) blob.participants[i] = { ...blob.participants[i], ...patch, updated_at: now };
  else
    blob.participants.push({
      id: crypto.randomUUID(),
      event_id: eventId,
      device_token: device,
      name: patch.name || "Ẩn danh",
      slots: patch.slots || [],
      area: patch.area || null,
      votes: patch.votes || [],
      updated_at: now,
    });
  writeLocal(code, blob);
}

export async function lockEvent(code: string, final_venue: string, final_slot: string) {
  const host = hostTokenFor(code);
  if (!host) throw new Error("Chỉ chủ kèo mới chốt được");
  if (sb) {
    const { error } = await sb
      .from("events")
      .update({ status: "locked", final_venue, final_slot })
      .eq("code", code)
      .eq("host_token", host);
    if (error) throw error;
    return;
  }
  const blob = readLocal(code);
  if (!blob) return;
  blob.event = { ...blob.event, status: "locked", final_venue, final_slot };
  writeLocal(code, blob);
}

/** Lắng nghe thay đổi để cập nhật realtime. Trả về hàm huỷ. */
export function subscribe(code: string, eventId: string, onChange: () => void) {
  if (sb) {
    const ch = sb
      .channel(`event-${eventId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "participants", filter: `event_id=eq.${eventId}` }, onChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "events", filter: `id=eq.${eventId}` }, onChange)
      .subscribe();
    return () => {
      sb?.removeChannel(ch);
    };
  }
  const h = () => onChange();
  const storageH = (e: StorageEvent) => e.key === lkey(code) && onChange();
  window.addEventListener("lenkeo:change", h);
  window.addEventListener("storage", storageH);
  return () => {
    window.removeEventListener("lenkeo:change", h);
    window.removeEventListener("storage", storageH);
  };
}
