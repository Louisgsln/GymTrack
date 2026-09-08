do $$
declare entity text;
begin
  foreach entity in array array['programs','program_routines'] loop
    execute format('create table public.%I (
      id uuid primary key,owner_id uuid not null references auth.users(id) on delete cascade,
      revision bigint not null check(revision>0),payload jsonb not null,updated_at timestamptz not null default now(),unique(id,owner_id),
      check(jsonb_typeof(payload)=''object''),
      check(payload ?& array[''id'',''ownerId'',''revision'',''createdAt'',''updatedAt'',''position'',''deletedAt'']),
      check(((payload->>''id'')::uuid=id) is true),
      check(((payload->>''ownerId'')::uuid=owner_id) is true),
      check(((payload->>''revision'')::bigint=revision) is true),
      check((jsonb_typeof(payload->''position'')=''number'' and (payload->>''position'')::numeric>=0 and mod((payload->>''position'')::numeric,1)=0) is true),
      check(payload->>''deletedAt'' is null or (payload->>''deletedAt'')::timestamptz is not null)
    )',entity);
    execute format('alter table public.%I enable row level security',entity);
    execute format('create policy owner_read on public.%I for select to authenticated using(owner_id=(select auth.uid()))',entity);
    execute format('revoke all on public.%I from anon,authenticated',entity);
    execute format('grant select on public.%I to authenticated',entity);
    execute format('create index on public.%I(owner_id,updated_at)',entity);
  end loop;
end $$;
alter table public.programs add constraint program_values check((
  jsonb_typeof(payload->'name')='string' and length(trim(payload->>'name')) between 1 and 160
  and jsonb_typeof(payload->'notes')='string' and length(payload->>'notes')<=10000
) is true);
create index programs_owner_position on public.programs(owner_id,((payload->>'position')::bigint)) where payload->>'deletedAt' is null;
alter table public.program_routines
  add column program_id uuid generated always as ((payload->>'programId')::uuid) stored not null,
  add column routine_id uuid generated always as ((payload->>'routineId')::uuid) stored not null,
  add foreign key(program_id,owner_id) references public.programs(id,owner_id),
  add foreign key(routine_id,owner_id) references public.routines(id,owner_id);
create index on public.program_routines(program_id,((payload->>'position')::bigint));
create index on public.program_routines(routine_id);
create or replace function public.apply_local_operation(
  p_operation_id uuid,p_entity_type text,p_entity_id uuid,p_base_revision bigint,p_payload jsonb
) returns text language plpgsql security definer set search_path='' as $$
declare
  owner uuid := auth.uid(); receipt public.sync_receipts;
  current_revision bigint; current_owner uuid;
begin
  if owner is null then raise exception 'AUTH_REQUIRED' using errcode='42501'; end if;
  if p_entity_type is null or not p_entity_type=any(array['exercises','workouts','workout_exercises','workout_sets','food_diary_entries','routines','routine_exercises','routine_sets','superset_groups','routine_folders','programs','program_routines']) then raise exception 'INVALID_ENTITY'; end if;
  if p_payload is null or p_base_revision is null or p_base_revision<0 or octet_length(p_payload::text)>100000
    or (p_payload->>'ownerId')::uuid is distinct from owner
    or (p_payload->>'id')::uuid is distinct from p_entity_id
    or (p_payload->>'revision')::bigint is distinct from p_base_revision+1 then
    raise exception 'INVALID_PAYLOAD' using errcode='42501';
  end if;
  perform pg_advisory_xact_lock(hashtextextended(owner::text,0));
  select * into receipt from public.sync_receipts where operation_id=p_operation_id;
  if found then
    if receipt.owner_id=owner and receipt.entity_type=p_entity_type and receipt.entity_id=p_entity_id and receipt.base_revision=p_base_revision and receipt.payload=p_payload then return 'DUPLICATE'; end if;
    raise exception 'OPERATION_ID_REUSED' using errcode='42501';
  end if;
  execute format('select revision,owner_id from public.%I where id=$1 for update',p_entity_type)
    into current_revision,current_owner using p_entity_id;
  if current_owner is not null and current_owner!=owner then raise exception 'OWNER_MISMATCH' using errcode='42501'; end if;
  if coalesce(current_revision,0)!=p_base_revision then return 'CONFLICT'; end if;
  execute format('insert into public.%I(id,owner_id,revision,payload) values ($1,$2,$3,$4)
    on conflict(id) do update set revision=excluded.revision,payload=excluded.payload,updated_at=now()',p_entity_type)
    using p_entity_id,owner,p_base_revision+1,p_payload;
  insert into public.sync_receipts(operation_id,owner_id,entity_type,entity_id,base_revision,payload)
    values(p_operation_id,owner,p_entity_type,p_entity_id,p_base_revision,p_payload);
  return 'APPLIED';
exception when unique_violation then return 'CONFLICT';
end $$;
revoke all on function public.apply_local_operation(uuid,text,uuid,bigint,jsonb) from public,anon;
grant execute on function public.apply_local_operation(uuid,text,uuid,bigint,jsonb) to authenticated;
