-- Fix Conversations RLS Update Policy
create policy "Participants can update their conversations"
  on public.conversations
  for update using (
    auth.uid() = buyer_id or auth.uid() = seller_id
  );

-- Auto-update last_message_at on new message
create or replace function public.handle_new_message()
returns trigger as $$
begin
  update public.conversations
  set last_message_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_message_inserted on public.messages;
create trigger on_message_inserted
  after insert on public.messages
  for each row execute procedure public.handle_new_message();
