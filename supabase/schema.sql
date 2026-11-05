-- Lên Kèo: schema cho bản preview. Chạy trong Supabase > SQL Editor > New query > Run.

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  title text not null,
  purpose text not null default 'an',
  dates text[] not null default '{}',
  expected_count int,
  names text[] not null default '{}',
  seed_venue text,
  host_token text not null,
  status text not null default 'open',
  final_venue text,
  final_slot text,
  created_at timestamptz not null default now()
);

create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  device_token text not null,
  slots text[] not null default '{}',
  area text,
  votes text[] not null default '{}',
  updated_at timestamptz not null default now(),
  unique (event_id, device_token)
);

create index if not exists participants_event_idx on public.participants(event_id);

alter table public.events enable row level security;
alter table public.participants enable row level security;

-- Bản preview: ai có link (mã kèo) đều đọc/ghi được. Sẽ siết lại ở bản sau.
drop policy if exists "events_read" on public.events;
drop policy if exists "events_insert" on public.events;
drop policy if exists "events_update" on public.events;
create policy "events_read" on public.events for select using (true);
create policy "events_insert" on public.events for insert with check (true);
create policy "events_update" on public.events for update using (true);

drop policy if exists "participants_read" on public.participants;
drop policy if exists "participants_insert" on public.participants;
drop policy if exists "participants_update" on public.participants;
create policy "participants_read" on public.participants for select using (true);
create policy "participants_insert" on public.participants for insert with check (true);
create policy "participants_update" on public.participants for update using (true);

-- Bật realtime cho 2 bảng
alter publication supabase_realtime add table public.events;
alter publication supabase_realtime add table public.participants;
