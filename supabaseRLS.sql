-- Enable RLS
alter table hero_class enable row level security;
alter table tribe enable row level security;
alter table "set" enable row level security;

-- Add updated_at tracking for metadata tables
alter table hero_class add column if not exists updated_at timestamp with time zone;
alter table tribe add column if not exists updated_at timestamp with time zone;
alter table "set" add column if not exists updated_at timestamp with time zone;

update hero_class set updated_at = coalesce(updated_at, created_at, timezone('utc', now()));
update tribe set updated_at = coalesce(updated_at, created_at, timezone('utc', now()));
update "set" set updated_at = coalesce(updated_at, created_at, timezone('utc', now()));

alter table hero_class alter column updated_at set default timezone('utc', now());
alter table tribe alter column updated_at set default timezone('utc', now());
alter table "set" alter column updated_at set default timezone('utc', now());

alter table hero_class alter column updated_at set not null;
alter table tribe alter column updated_at set not null;
alter table "set" alter column updated_at set not null;

-- Ensure updated_at is refreshed automatically on each update
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_hero_class_updated_at on hero_class;
create trigger set_hero_class_updated_at
before update on hero_class
for each row
execute function set_updated_at();

drop trigger if exists set_tribe_updated_at on tribe;
create trigger set_tribe_updated_at
before update on tribe
for each row
execute function set_updated_at();

drop trigger if exists set_set_updated_at on "set";
create trigger set_set_updated_at
before update on "set"
for each row
execute function set_updated_at();

-- Create policies for hero_class
create policy "Public hero classes are viewable by everyone"
on hero_class for select
using (true);

create policy "Only authenticated users can insert hero classes"
on hero_class for insert
to authenticated
with check (true);

create policy "Only authenticated users can update hero classes"
on hero_class for update
to authenticated
using (true)
with check (true);

create policy "Only authenticated users can delete hero classes"
on hero_class for delete
to authenticated
using (true);

-- Create policies for tribe
create policy "Public tribes are viewable by everyone"
on tribe for select
using (true);

create policy "Only authenticated users can insert tribes"
on tribe for insert
to authenticated
with check (true);

create policy "Only authenticated users can update tribes"
on tribe for update
to authenticated
using (true)
with check (true);

create policy "Only authenticated users can delete tribes"
on tribe for delete
to authenticated
using (true);

-- Create policies for set
create policy "Public sets are viewable by everyone"
on "set" for select
using (true);

create policy "Only authenticated users can insert sets"
on "set" for insert
to authenticated
with check (true);

create policy "Only authenticated users can update sets"
on "set" for update
to authenticated
using (true)
with check (true);

create policy "Only authenticated users can delete sets"
on "set" for delete
to authenticated
using (true);