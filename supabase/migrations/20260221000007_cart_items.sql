-- CART ITEMS TABLE
create table if not exists public.cart_items (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    quantity integer default 1 check (quantity > 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, product_id)
);

-- RLS POLICIES
alter table public.cart_items enable row level security;

create policy "Users can view their own cart items." on public.cart_items 
for select using (auth.uid() = user_id);

create policy "Users can manage their own cart items." on public.cart_items 
for all using (auth.uid() = user_id);

-- Enable Realtime
alter publication supabase_realtime add table cart_items;
