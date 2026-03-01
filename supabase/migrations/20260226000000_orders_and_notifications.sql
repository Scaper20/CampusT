-- 1. ORDERS TABLE
create table if not exists public.orders (
    id uuid default gen_random_uuid() primary key,
    buyer_id uuid references public.profiles(id) on delete cascade not null,
    total_price decimal(12,2) not null,
    meetup_location text not null,
    meetup_date date not null,
    meetup_time_window text not null,
    status text check (status in ('pending', 'completed', 'cancelled')) default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists orders_buyer_idx on public.orders(buyer_id);

-- 2. ORDER ITEMS TABLE
create table if not exists public.order_items (
    id uuid default gen_random_uuid() primary key,
    order_id uuid references public.orders(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete restrict not null,
    seller_id uuid references public.profiles(id) on delete cascade not null,
    quantity integer not null default 1,
    price_at_time decimal(12,2) not null,
    status text check (status in ('pending', 'accepted', 'rejected', 'completed')) default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists order_items_order_idx on public.order_items(order_id);
create index if not exists order_items_seller_idx on public.order_items(seller_id);

-- 3. NOTIFICATIONS TABLE
create table if not exists public.notifications (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    type text not null, -- 'order_placed', 'message_received', etc.
    title text not null,
    message text not null,
    link text, -- optional deep link destination
    is_read boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists notifications_user_idx on public.notifications(user_id, created_at desc);

-- RLS POLICIES

-- Orders
alter table public.orders enable row level security;
create policy "Users can view their own orders." on public.orders for select using (auth.uid() = buyer_id);
create policy "Users can create their own orders." on public.orders for insert with check (auth.uid() = buyer_id);

-- Order Items
alter table public.order_items enable row level security;
create policy "Buyers can view their order items." on public.order_items for select using (
    exists (select 1 from public.orders where id = order_id and buyer_id = auth.uid())
);
create policy "Sellers can view their order items." on public.order_items for select using (auth.uid() = seller_id);
create policy "Buyers can create order items." on public.order_items for insert with check (
    exists (select 1 from public.orders where id = order_id and buyer_id = auth.uid())
);
create policy "Sellers can update their order item status." on public.order_items for update using (auth.uid() = seller_id);

-- Notifications
alter table public.notifications enable row level security;
create policy "Users can view their own notifications." on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update their own notifications." on public.notifications for update using (auth.uid() = user_id);
-- Trigger inserts usually happen via security definer RPC or server actions acting as service role, so we don't strictly need public insert access, but let's allow authenticated users to insert system notifications if needed.
create policy "Users can insert notifications." on public.notifications for insert with check (auth.uid() is not null);

-- Realtime enrichment for notifications
alter publication supabase_realtime add table notifications;
