-- Add function to increment product views
create or replace function public.increment_views(product_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update public.products
  set views_count = views_count + 1
  where id = product_id;
end;
$$;
