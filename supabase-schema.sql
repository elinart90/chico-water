-- Chico Water Limited — Supabase Schema
-- Run this in your Supabase SQL editor

-- Users table (custom auth, no Supabase Auth)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  phone text,
  password_hash text not null,
  role text not null default 'customer' check (role in ('customer','salesperson','admin','driver')),
  segment text check (segment in ('household','retail','wholesale','corporate')),
  created_at timestamptz default now()
);

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null check (category in ('bottled','sachet','empty_bottle')),
  size text,
  unit text default 'unit',
  price_household numeric(10,2) not null,
  price_retail numeric(10,2) not null,
  price_wholesale numeric(10,2) not null,
  price_corporate numeric(10,2) not null,
  stock integer default 0,
  image_url text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_id uuid references users(id),
  customer_name text not null,
  customer_phone text not null,
  segment text not null check (segment in ('household','retail','wholesale','corporate')),
  items jsonb not null default '[]',
  subtotal numeric(10,2) not null,
  delivery_fee numeric(10,2) default 15,
  total numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending','confirmed','packed','in_transit','delivered','cancelled')),
  payment_method text not null check (payment_method in ('momo','card','cash')),
  payment_status text default 'pending' check (payment_status in ('pending','paid')),
  delivery_address text not null,
  delivery_region text not null,
  delivery_notes text,
  preferred_date date,
  salesperson_id uuid references users(id),
  driver_id uuid references users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Inventory log
create table if not exists inventory_log (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  change_amount integer not null,
  reason text,
  created_at timestamptz default now()
);

-- Seed products
insert into products (name, description, category, size, unit, price_household, price_retail, price_wholesale, price_corporate, stock) values
  ('500ml Bottled Water', 'Pure 500ml water, great for on-the-go.', 'bottled', '500ml', 'bottle', 2.50, 2.20, 1.80, 1.90, 5000),
  ('1L Bottled Water', 'Premium 1-litre bottled water.', 'bottled', '1L', 'bottle', 4.50, 4.00, 3.20, 3.50, 3000),
  ('1.5L Bottled Water', 'Family-size pure water.', 'bottled', '1.5L', 'bottle', 6.00, 5.40, 4.50, 4.80, 2000),
  ('Sachet Water (Bag)', '30 sachets per bag.', 'sachet', '500ml x 30', 'bag', 8.00, 7.00, 5.50, 6.00, 8000),
  ('Sachet Water (Crate)', '12 bags per crate.', 'sachet', '30-sachet bags x 12', 'crate', 90.00, 80.00, 62.00, 68.00, 400),
  ('Empty 500ml Bottles', 'Food-grade PET 500ml bottles.', 'empty_bottle', '500ml', 'pack of 24', 18.00, 15.00, 12.00, 13.00, 10000),
  ('Empty 1L Bottles', 'Durable 1L PET bottles.', 'empty_bottle', '1L', 'pack of 12', 20.00, 17.00, 14.00, 15.50, 6000);

-- RLS policies (enable after setup)
alter table orders enable row level security;
alter table users enable row level security;
alter table products enable row level security;

-- Enable customers to read their own orders
create policy "Customers read own orders" on orders
  for select using (customer_id::text = current_setting('app.user_id', true));

-- Salesperson can read all orders
create policy "Salesperson reads all orders" on orders
  for select using (current_setting('app.user_role', true) in ('salesperson','admin'));

-- Products are public for select
create policy "Products are viewable by all" on products
  for select using (active = true);
