-- Tables
create table if not exists profiles (
  id uuid primary key,
  display_name text not null,
  font_family text not null default 'system-ui',
  text_color text not null default '#111827',
  bubble_color text not null default '#e5e7eb',
  show_status_bar boolean not null default true,
  statuses text[] not null default '{}',
  current_status text,
  created_at timestamp with time zone default now()
);

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null default 'Private Room',
  created_by uuid,
  created_at timestamp with time zone default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default now(),
  font_family text not null,
  text_color text not null,
  bubble_color text not null
);

-- Enable RLS
alter table profiles enable row level security;
alter table rooms enable row level security;
alter table messages enable row level security;

-- Policies
create policy "profiles_read_all" on profiles
for select using (true);

create policy "profiles_upsert_self" on profiles
for insert with check (auth.uid() = id);

create policy "profiles_update_self" on profiles
for update using (auth.uid() = id);

create policy "rooms_read_all" on rooms
for select using (true);

create policy "rooms_insert_any" on rooms
for insert with check (true);

create policy "messages_read_all" on messages
for select using (true);

create policy "messages_insert_auth" on messages
for insert with check (auth.uid() = user_id);
