-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. UNIVERSITIES TABLE
create table if not exists public.universities (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    domain text,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Initial university seed removed as per request

-- 2. PROFILES TABLE
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    system_role text check (system_role in ('user', 'admin')) default 'user',
    university_id uuid references public.universities(id) on delete set null,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. PRODUCTS TABLE
create table if not exists public.products (
    id uuid default gen_random_uuid() primary key,
    seller_id uuid references public.profiles(id) on delete cascade not null,
    university_id uuid references public.universities(id) on delete restrict not null,
    title text not null,
    description text,
    price decimal(12,2) not null,
    category text not null,
    images text[] default '{}',
    status text check (status in ('active', 'sold', 'removed')) default 'active',
    is_featured boolean default false,
    views_count integer default 0,
    search_vector tsvector generated always as (
        to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))
    ) stored,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for search vector
create index if not exists products_search_idx on public.products using gin(search_vector);
create index if not exists products_university_idx on public.products(university_id);
create index if not exists products_seller_idx on public.products(seller_id);
create index if not exists products_status_idx on public.products(status);

-- 4. CONVERSATIONS TABLE
create table if not exists public.conversations (
    id uuid default gen_random_uuid() primary key,
    buyer_id uuid references public.profiles(id) on delete cascade not null,
    seller_id uuid references public.profiles(id) on delete cascade not null,
    product_id uuid references public.products(id) on delete cascade not null,
    last_message_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(buyer_id, seller_id, product_id)
);

-- 5. MESSAGES TABLE
create table if not exists public.messages (
    id uuid default gen_random_uuid() primary key,
    conversation_id uuid references public.conversations(id) on delete cascade not null,
    sender_id uuid references public.profiles(id) on delete cascade not null,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for messages
create index if not exists messages_conversation_idx on public.messages(conversation_id, created_at);

-- 6. PURCHASE REQUESTS TABLE
create table if not exists public.purchase_requests (
    id uuid default gen_random_uuid() primary key,
    product_id uuid references public.products(id) on delete cascade not null,
    buyer_id uuid references public.profiles(id) on delete cascade not null,
    seller_id uuid references public.profiles(id) on delete cascade not null,
    status text check (status in ('pending', 'accepted', 'rejected', 'completed')) default 'pending',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists purchase_requests_seller_idx on public.purchase_requests(seller_id);

-- RLS POLICIES

-- Profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on public.profiles for select using (true);
create policy "Users can update their own profiles." on public.profiles for update using (auth.uid() = id);

-- Universities
alter table public.universities enable row level security;
create policy "Universities are viewable by everyone." on public.universities for select using (true);

-- Products
alter table public.products enable row level security;
create policy "Active products are viewable by everyone." on public.products for select using (status = 'active');
create policy "Sellers can manage their own products." on public.products for all using (auth.uid() = seller_id);
create policy "Admins can manage all products." on public.products for all using (
    exists (select 1 from public.profiles where id = auth.uid() and system_role = 'admin')
);

-- Conversations
alter table public.conversations enable row level security;
create policy "Participants can view their conversations." on public.conversations for select using (
    auth.uid() = buyer_id or auth.uid() = seller_id
);
create policy "Users can start conversations." on public.conversations for insert with check (
    auth.uid() = buyer_id
);

-- Messages
alter table public.messages enable row level security;
create policy "Participants can view messages." on public.messages for select using (
    exists (
        select 1 from public.conversations 
        where id = conversation_id and (buyer_id = auth.uid() or seller_id = auth.uid())
    )
);
create policy "Participants can send messages." on public.messages for insert with check (
    exists (
        select 1 from public.conversations 
        where id = conversation_id and (buyer_id = auth.uid() or seller_id = auth.uid())
    ) and auth.uid() = sender_id
);

-- Purchase Requests
alter table public.purchase_requests enable row level security;
create policy "Users can view their purchase requests." on public.purchase_requests for select using (auth.uid() = buyer_id or auth.uid() = seller_id);
create policy "Users can create purchase requests." on public.purchase_requests for insert with check (auth.uid() = buyer_id);
create policy "Sellers can update status of requests." on public.purchase_requests for update using (auth.uid() = seller_id);

-- Realtime enrichment
alter publication supabase_realtime add table messages;
