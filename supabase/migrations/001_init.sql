/*
 supabase/migrations/001_init.sql

 Initial database schema for the ride booking application.
*/
create extension if not exists "pgcrypto";

create table if not exists public.ride_options (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  price_type text not null check (price_type in ('fixed', 'per_km', 'percentage')),
  price_value numeric(10,2) not null default 0,
  is_active boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  pickup_address text not null,
  dropoff_address text not null,
  customer_email text not null,
  estimated_distance_km numeric(10,2) not null default 0,
  base_price numeric(10,2) not null default 0,
  distance_price numeric(10,2) not null default 0,
  options_price numeric(10,2) not null default 0,
  total_estimated_price numeric(10,2) not null default 0,
  currency text not null default 'EUR',
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.booking_request_options (
  id uuid primary key default gen_random_uuid(),
  booking_request_id uuid not null references public.booking_requests(id) on delete cascade,
  ride_option_id uuid not null references public.ride_options(id) on delete restrict,
  option_code_snapshot text not null,
  option_name_snapshot text not null,
  price_type_snapshot text not null,
  price_value_snapshot numeric(10,2) not null default 0,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);

create index if not exists idx_ride_options_is_active
  on public.ride_options(is_active);

create index if not exists idx_booking_requests_created_at
  on public.booking_requests(created_at desc);

create index if not exists idx_booking_request_options_booking_request_id
  on public.booking_request_options(booking_request_id);