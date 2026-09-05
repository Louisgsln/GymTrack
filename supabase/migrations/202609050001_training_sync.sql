-- First vertical slice only. Future domain tables use subsequent migrations.
-- Each entity has a validated JSON snapshot plus relational identity/ownership.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (length(display_name) <= 120),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy profile_owner on public.profiles for all to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

do $$
declare entity text;
begin
  foreach entity in array array['exercises','workouts','workout_exercises','workout_sets','food_diary_entries'] loop
    execute format('create table public.%I (
      id uuid primary key,
      owner_id uuid not null references auth.users(id) on delete cascade,
      revision bigint not null check (revision > 0),
      payload jsonb not null check (jsonb_typeof(payload) = ''object''),
      updated_at timestamptz not null default now(),
      unique(id, owner_id),
      check (payload ?& array[''id'',''ownerId'',''revision'',''createdAt'',''updatedAt'']),
      check ((payload->>''id'')::uuid = id),
      check ((payload->>''ownerId'')::uuid = owner_id),
      check ((payload->>''revision'')::bigint = revision)
    )', entity);
    execute format('alter table public.%I enable row level security', entity);
    execute format('create policy owner_read on public.%I for select to authenticated using (owner_id = (select auth.uid()))', entity);
    execute format('create index on public.%I(owner_id, updated_at)', entity);
    execute format('revoke all on public.%I from anon, authenticated', entity);
    execute format('grant select on public.%I to authenticated', entity);
  end loop;
end $$;

alter table public.exercises add constraint exercise_values check (
  payload ?& array['name','primaryMuscle','equipment','trackingType','defaultRestSeconds']
  and jsonb_typeof(payload->'name') = 'string'
  and jsonb_typeof(payload->'primaryMuscle') = 'string'
  and jsonb_typeof(payload->'equipment') = 'string'
  and jsonb_typeof(payload->'defaultRestSeconds') = 'number'
  and length(trim(payload->>'name')) between 1 and 120
  and payload->>'trackingType' in ('WEIGHT_REPS','BODYWEIGHT_REPS','ASSISTED_BODYWEIGHT','WEIGHT_DURATION','DURATION','DISTANCE','DISTANCE_DURATION')
  and (payload->>'defaultRestSeconds')::numeric between 0 and 3600
);
alter table public.workouts add constraint workout_values check (
  payload ?& array['title','status','privacy','startedAt','finishedAt']
  and jsonb_typeof(payload->'title') = 'string'
  and jsonb_typeof(payload->'status') = 'string'
  and jsonb_typeof(payload->'privacy') = 'string'
  and jsonb_typeof(payload->'startedAt') = 'string'
  and length(trim(payload->>'title')) between 1 and 160
  and payload->>'status' in ('ACTIVE','FINISHED','DISCARDED')
  and payload->>'privacy' in ('PRIVATE','FRIENDS','PUBLIC')
  and ((payload->>'status' = 'ACTIVE' and payload->>'finishedAt' is null)
    or (payload->>'status' != 'ACTIVE' and payload->>'finishedAt' is not null))
);
create unique index one_active_workout on public.workouts(owner_id) where payload->>'status' = 'ACTIVE';
alter table public.workout_exercises
  add column workout_id uuid generated always as ((payload->>'workoutId')::uuid) stored not null,
  add column exercise_id uuid generated always as ((payload->>'exerciseId')::uuid) stored not null,
  add foreign key (workout_id, owner_id) references public.workouts(id, owner_id),
  add foreign key (exercise_id, owner_id) references public.exercises(id, owner_id);
create index on public.workout_exercises(workout_id);
alter table public.workout_sets
  add column workout_exercise_id uuid generated always as ((payload->>'workoutExerciseId')::uuid) stored not null,
  add foreign key (workout_exercise_id, owner_id) references public.workout_exercises(id, owner_id),
  add constraint set_values check (
    payload ?& array['weightKg','reps','type','rpe','rir']
    and jsonb_typeof(payload->'weightKg') = 'number'
    and jsonb_typeof(payload->'reps') = 'number'
    and jsonb_typeof(payload->'type') = 'string'
    and (payload->>'weightKg')::numeric between 0 and 2000
    and (payload->>'reps')::numeric between 0 and 10000
    and (payload->>'reps')::numeric = trunc((payload->>'reps')::numeric)
    and payload->>'type' in ('NORMAL','WARMUP','DROP_SET','FAILURE','AMRAP','BACKOFF','MYO_REP','CUSTOM')
    and (payload->>'rpe' is null or ((payload->>'rpe')::numeric between 6 and 10 and mod((payload->>'rpe')::numeric * 2, 1) = 0))
    and (payload->>'rir' is null or ((payload->>'rir')::numeric between 0 and 10 and mod((payload->>'rir')::numeric, 1) = 0))
  );
create index on public.workout_sets(workout_exercise_id);

create function public.valid_nutrients(value jsonb) returns boolean
language sql immutable set search_path = '' as $$
  select jsonb_typeof(value) = 'object' and not exists (
    select 1 from jsonb_each(value) n where
      jsonb_typeof(n.value) is distinct from 'object'
      or jsonb_typeof(n.value->'value') is distinct from 'number'
      or (n.value->>'value')::numeric < 0
      or n.value->>'unit' is null
      or n.value->>'unit' not in ('kcal','kJ','g','mg','µg')
  );
$$;
alter table public.food_diary_entries add constraint diary_values check (
  payload ?& array['diaryDate','meal','name','nutrients','source']
  and jsonb_typeof(payload->'diaryDate') = 'string'
  and jsonb_typeof(payload->'meal') = 'string'
  and jsonb_typeof(payload->'name') = 'string'
  and jsonb_typeof(payload->'source') = 'string'
  and (payload->>'diaryDate')::date is not null
  and length(trim(payload->>'meal')) between 1 and 100
  and length(trim(payload->>'name')) between 1 and 160
  and payload->>'source' in ('QUICK_ADD','CUSTOM','PROVIDER')
  and public.valid_nutrients(payload->'nutrients')
);
create index diary_owner_date on public.food_diary_entries(owner_id, (payload->>'diaryDate'));

create table public.sync_receipts (
  operation_id uuid primary key, owner_id uuid not null references auth.users(id) on delete cascade,
  entity_type text not null, entity_id uuid not null, base_revision bigint not null,
  payload jsonb not null, applied_at timestamptz not null default now()
);
alter table public.sync_receipts enable row level security;
revoke all on public.sync_receipts from anon, authenticated;

create function public.apply_local_operation(
  p_operation_id uuid, p_entity_type text, p_entity_id uuid, p_base_revision bigint, p_payload jsonb
) returns text language plpgsql security definer set search_path = '' as $$
declare
  owner uuid := auth.uid();
  receipt public.sync_receipts;
  current_revision bigint;
  current_owner uuid;
begin
  if owner is null then raise exception 'AUTH_REQUIRED' using errcode = '42501'; end if;
  if p_entity_type is null or not p_entity_type = any(array['exercises','workouts','workout_exercises','workout_sets','food_diary_entries']) then
    raise exception 'INVALID_ENTITY';
  end if;
  if p_payload is null or p_base_revision is null or p_base_revision < 0 or octet_length(p_payload::text) > 100000
    or (p_payload->>'ownerId')::uuid is distinct from owner
    or (p_payload->>'id')::uuid is distinct from p_entity_id
    or (p_payload->>'revision')::bigint is distinct from p_base_revision + 1 then
    raise exception 'INVALID_PAYLOAD' using errcode = '42501';
  end if;
  -- Serialize all operations for one owner, including duplicate operation ids.
  perform pg_advisory_xact_lock(hashtextextended(owner::text, 0));
  select * into receipt from public.sync_receipts where operation_id = p_operation_id;
  if found then
    if receipt.owner_id = owner and receipt.entity_type = p_entity_type and receipt.entity_id = p_entity_id
      and receipt.base_revision = p_base_revision and receipt.payload = p_payload then return 'DUPLICATE'; end if;
    raise exception 'OPERATION_ID_REUSED' using errcode = '42501';
  end if;
  execute format('select revision, owner_id from public.%I where id=$1 for update', p_entity_type)
    into current_revision, current_owner using p_entity_id;
  if current_owner is not null and current_owner != owner then raise exception 'OWNER_MISMATCH' using errcode = '42501'; end if;
  if coalesce(current_revision, 0) != p_base_revision then return 'CONFLICT'; end if;
  execute format('insert into public.%I(id,owner_id,revision,payload) values ($1,$2,$3,$4)
    on conflict(id) do update set revision=excluded.revision,payload=excluded.payload,updated_at=now()', p_entity_type)
    using p_entity_id, owner, p_base_revision + 1, p_payload;
  insert into public.sync_receipts(operation_id,owner_id,entity_type,entity_id,base_revision,payload)
    values (p_operation_id,owner,p_entity_type,p_entity_id,p_base_revision,p_payload);
  return 'APPLIED';
exception when unique_violation then return 'CONFLICT';
end $$;
revoke all on function public.apply_local_operation(uuid,text,uuid,bigint,jsonb) from public, anon;
grant execute on function public.apply_local_operation(uuid,text,uuid,bigint,jsonb) to authenticated;
