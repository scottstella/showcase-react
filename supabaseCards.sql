-- Cards domain schema + RLS + storage policies
-- Apply AFTER your base tables exist (`hero_class`, `tribe`, `"set"`).
-- Safe to re-run in most cases (uses IF NOT EXISTS / DROP IF EXISTS patterns).

-- Extensions (Supabase usually has these enabled already)
create extension if not exists "pgcrypto";

-- Enums (new categorical domains not modeled as tables)
do $$
begin
  if not exists (select 1 from pg_type where typname = 'card_type_enum') then
    create type card_type_enum as enum (
      'MINION',
      'SPELL',
      'WEAPON',
      'HERO',
      'LOCATION'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'rarity_enum') then
    create type rarity_enum as enum (
      'COMMON',
      'RARE',
      'EPIC',
      'LEGENDARY'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'spell_school_enum') then
    create type spell_school_enum as enum (
      'ARCANE',
      'FEL',
      'FIRE',
      'FROST',
      'HOLY',
      'NATURE',
      'SHADOW'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'mechanic_enum') then
    create type mechanic_enum as enum (
      'TAUNT',
      'DIVINE_SHIELD',
      'BATTLECRY',
      'DEATHRATTLE',
      'RUSH',
      'WINDFURY',
      'LIFESTEAL',
      'POISONOUS',
      'REBORN',
      'STEALTH',
      'IMMUNE',
      'ELUSIVE',
      'MEGA_WINDFURY',
      'OVERLOAD',
      'SECRET',
      'COMBO',
      'INSPIRE',
      'JADE_GOLEM',
      'ECHO',
      'MAGNETIC',
      'OUTCAST',
      'SPELL_DAMAGE',
      'FREEZE',
      'SILENCE',
      'DISCOVER'
    );
  end if;
end $$;

-- Ensure NEUTRAL class exists for relational modeling of neutral cards
insert into hero_class (name, created_at, updated_at)
select 'NEUTRAL', timezone('utc', now()), timezone('utc', now())
where not exists (select 1 from hero_class where name = 'NEUTRAL');

create table if not exists card (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  slug text not null,
  flavor_text text,

  card_type card_type_enum not null,
  rarity rarity_enum not null,
  spell_school spell_school_enum,

  set_id integer not null references "set"(id) on delete restrict,
  hero_class_id integer not null references hero_class(id) on delete restrict,
  race_tribe_id integer references tribe(id) on delete set null,

  mana_cost integer not null,
  attack integer,
  health integer,
  durability integer,

  text text not null default '',

  is_collectible boolean not null default true,
  is_legendary boolean not null default false,
  is_token boolean not null default false,

  image_url text,
  image_path text,
  artist text,

  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),

  constraint card_slug_unique unique (slug),
  constraint card_mana_non_negative check (mana_cost >= 0),
  constraint card_attack_non_negative check (attack is null or attack >= 0),
  constraint card_health_non_negative check (health is null or health >= 0),
  constraint card_durability_non_negative check (durability is null or durability >= 0),

  constraint card_minion_stats check (
    card_type <> 'MINION'
    or (attack is not null and health is not null)
  ),
  constraint card_weapon_stats check (
    card_type <> 'WEAPON'
    or (attack is not null and durability is not null)
  ),
  constraint card_hero_stats check (
    card_type <> 'HERO'
    or (attack is not null and health is not null)
  ),
  constraint card_spell_no_board_stats check (
    card_type <> 'SPELL'
    or (attack is null and health is null and durability is null)
  ),
  constraint card_location_no_board_stats check (
    card_type <> 'LOCATION'
    or (attack is null and health is null and durability is null)
  )
);

create index if not exists card_name_idx on card (name);
create index if not exists card_set_idx on card (set_id);
create index if not exists card_class_idx on card (hero_class_id);
create index if not exists card_rarity_idx on card (rarity);
create index if not exists card_mana_idx on card (mana_cost);

create table if not exists card_mechanic_map (
  card_id uuid not null references card(id) on delete cascade,
  mechanic mechanic_enum not null,
  primary key (card_id, mechanic)
);

create table if not exists card_keyword (
  id bigserial primary key,
  card_id uuid not null references card(id) on delete cascade,
  keyword text not null,
  constraint card_keyword_unique unique (card_id, keyword)
);

create index if not exists card_keyword_card_idx on card_keyword (card_id);

-- Two FKs to card: PostgREST embeds from card must use a hint, e.g.
--   card_related_card!card_related_card_card_id_fkey (...)
-- (see CardService.cardSelectQuery in the app).
create table if not exists card_related_card (
  card_id uuid not null references card(id) on delete cascade,
  related_card_id uuid not null references card(id) on delete cascade,
  constraint card_related_not_self check (card_id <> related_card_id),
  constraint card_related_unique unique (card_id, related_card_id)
);

create index if not exists card_related_from_idx on card_related_card (card_id);
create index if not exists card_related_to_idx on card_related_card (related_card_id);

-- updated_at trigger (reuses function name from supabaseRLS.sql if present)
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_card_updated_at on card;
create trigger set_card_updated_at
before update on card
for each row
execute function set_updated_at();

-- RLS
alter table card enable row level security;
alter table card_mechanic_map enable row level security;
alter table card_keyword enable row level security;
alter table card_related_card enable row level security;

-- card policies
drop policy if exists "Public cards are viewable by everyone" on card;
create policy "Public cards are viewable by everyone"
on card for select
using (true);

drop policy if exists "Only authenticated users can insert cards" on card;
create policy "Only authenticated users can insert cards"
on card for insert
to authenticated
with check (true);

drop policy if exists "Only authenticated users can update cards" on card;
create policy "Only authenticated users can update cards"
on card for update
to authenticated
using (true)
with check (true);

drop policy if exists "Only authenticated users can delete cards" on card;
create policy "Only authenticated users can delete cards"
on card for delete
to authenticated
using (true);

-- child table policies (inherit access via FK checks; keep same public-read + auth-write pattern)
drop policy if exists "Public card mechanics are viewable by everyone" on card_mechanic_map;
create policy "Public card mechanics are viewable by everyone"
on card_mechanic_map for select
using (true);

drop policy if exists "Only authenticated users can insert card mechanics" on card_mechanic_map;
create policy "Only authenticated users can insert card mechanics"
on card_mechanic_map for insert
to authenticated
with check (true);

drop policy if exists "Only authenticated users can update card mechanics" on card_mechanic_map;
create policy "Only authenticated users can update card mechanics"
on card_mechanic_map for update
to authenticated
using (true)
with check (true);

drop policy if exists "Only authenticated users can delete card mechanics" on card_mechanic_map;
create policy "Only authenticated users can delete card mechanics"
on card_mechanic_map for delete
to authenticated
using (true);

drop policy if exists "Public card keywords are viewable by everyone" on card_keyword;
create policy "Public card keywords are viewable by everyone"
on card_keyword for select
using (true);

drop policy if exists "Only authenticated users can insert card keywords" on card_keyword;
create policy "Only authenticated users can insert card keywords"
on card_keyword for insert
to authenticated
with check (true);

drop policy if exists "Only authenticated users can update card keywords" on card_keyword;
create policy "Only authenticated users can update card keywords"
on card_keyword for update
to authenticated
using (true)
with check (true);

drop policy if exists "Only authenticated users can delete card keywords" on card_keyword;
create policy "Only authenticated users can delete card keywords"
on card_keyword for delete
to authenticated
using (true);

drop policy if exists "Public card relations are viewable by everyone" on card_related_card;
create policy "Public card relations are viewable by everyone"
on card_related_card for select
using (true);

drop policy if exists "Only authenticated users can insert card relations" on card_related_card;
create policy "Only authenticated users can insert card relations"
on card_related_card for insert
to authenticated
with check (true);

drop policy if exists "Only authenticated users can update card relations" on card_related_card;
create policy "Only authenticated users can update card relations"
on card_related_card for update
to authenticated
using (true)
with check (true);

drop policy if exists "Only authenticated users can delete card relations" on card_related_card;
create policy "Only authenticated users can delete card relations"
on card_related_card for delete
to authenticated
using (true);

-- Storage bucket for card images (public read URLs)
insert into storage.buckets (id, name, public)
values ('card-images', 'card-images', true)
on conflict (id) do update set public = excluded.public;

-- Storage policies (objects live under bucket `card-images`)
drop policy if exists "Public read card images" on storage.objects;
create policy "Public read card images"
on storage.objects for select
using (bucket_id = 'card-images');

drop policy if exists "Authenticated upload card images" on storage.objects;
create policy "Authenticated upload card images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'card-images');

drop policy if exists "Authenticated update card images" on storage.objects;
create policy "Authenticated update card images"
on storage.objects for update
to authenticated
using (bucket_id = 'card-images')
with check (bucket_id = 'card-images');

drop policy if exists "Authenticated delete card images" on storage.objects;
create policy "Authenticated delete card images"
on storage.objects for delete
to authenticated
using (bucket_id = 'card-images');
