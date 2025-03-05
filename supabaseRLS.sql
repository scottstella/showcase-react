-- Enable RLS
alter table hero_class enable row level security;
alter table tribe enable row level security;
alter table set enable row level security;

-- Create policies for hero_class
create policy "Public hero classes are viewable by everyone"
on hero_class for select
using (true);

create policy "Only authenticated users can insert hero classes"
on hero_class for insert
to authenticated
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

create policy "Only authenticated users can delete tribes"
on tribe for delete
to authenticated
using (true);

-- Create policies for set
create policy "Public sets are viewable by everyone"
on set for select
using (true);

create policy "Only authenticated users can insert sets"
on set for insert
to authenticated
with check (true);

create policy "Only authenticated users can delete sets"
on set for delete
to authenticated
using (true);