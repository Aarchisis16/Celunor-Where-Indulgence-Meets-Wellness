
-- ===== roles =====
create type public.app_role as enum ('admin','user');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);
grant select, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "own profile update" on public.profiles for update to authenticated using (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "read own roles" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.admin_exists()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where role = 'admin')
$$;
grant execute on function public.admin_exists() to anon, authenticated;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email) on conflict do nothing;
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;
  end if;
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- ===== catalogue =====
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  price numeric(10,2) not null default 0,
  sale_price numeric(10,2),
  category_id uuid references public.categories(id) on delete set null,
  images text[] not null default '{}',
  ingredients text,
  net_quantity text,
  in_stock boolean not null default true,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customization_options (
  id uuid primary key default gen_random_uuid(),
  group_key text not null,
  group_label text not null,
  name text not null,
  price_delta numeric(10,2) not null default 0,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gift_box_sizes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  capacity int not null,
  price numeric(10,2) not null default 0,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gift_box_addons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null default 0,
  allows_message boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  instructions text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.site_settings (
  key text primary key,
  value text,
  label text,
  group_key text not null default 'general',
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default 'CEL-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8)),
  customer_name text not null,
  phone text not null,
  email text,
  address text not null,
  city text not null,
  state text not null,
  pincode text not null,
  notes text,
  subtotal numeric(10,2) not null default 0,
  delivery_charge numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  payment_method text,
  payment_status text not null default 'pending',
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  item_type text not null default 'product',
  name text not null,
  unit_price numeric(10,2) not null default 0,
  quantity int not null default 1,
  line_total numeric(10,2) not null default 0,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- grants
grant select on public.categories, public.products, public.customization_options,
  public.gift_box_sizes, public.gift_box_addons, public.payment_methods, public.site_settings to anon, authenticated;
grant insert, update, delete on public.categories, public.products, public.customization_options,
  public.gift_box_sizes, public.gift_box_addons, public.payment_methods, public.site_settings to authenticated;
grant insert on public.orders, public.order_items to anon, authenticated;
grant select, update, delete on public.orders, public.order_items to authenticated;
grant all on public.categories, public.products, public.customization_options, public.gift_box_sizes,
  public.gift_box_addons, public.payment_methods, public.site_settings, public.orders, public.order_items to service_role;

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.customization_options enable row level security;
alter table public.gift_box_sizes enable row level security;
alter table public.gift_box_addons enable row level security;
alter table public.payment_methods enable row level security;
alter table public.site_settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "public read active categories" on public.categories for select to anon, authenticated using (is_active);
create policy "admin manage categories" on public.categories for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "public read active products" on public.products for select to anon, authenticated using (is_active);
create policy "admin manage products" on public.products for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "public read active options" on public.customization_options for select to anon, authenticated using (is_active);
create policy "admin manage options" on public.customization_options for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "public read active sizes" on public.gift_box_sizes for select to anon, authenticated using (is_active);
create policy "admin manage sizes" on public.gift_box_sizes for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "public read active addons" on public.gift_box_addons for select to anon, authenticated using (is_active);
create policy "admin manage addons" on public.gift_box_addons for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "public read active payment methods" on public.payment_methods for select to anon, authenticated using (is_active);
create policy "admin manage payment methods" on public.payment_methods for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "public read settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admin manage settings" on public.site_settings for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "anyone can place order" on public.orders for insert to anon, authenticated with check (true);
create policy "admin read orders" on public.orders for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin update orders" on public.orders for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "admin delete orders" on public.orders for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create policy "anyone can add order items" on public.order_items for insert to anon, authenticated with check (true);
create policy "admin read order items" on public.order_items for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin manage order items" on public.order_items for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create trigger t_categories_updated before update on public.categories for each row execute function public.touch_updated_at();
create trigger t_products_updated before update on public.products for each row execute function public.touch_updated_at();
create trigger t_options_updated before update on public.customization_options for each row execute function public.touch_updated_at();
create trigger t_sizes_updated before update on public.gift_box_sizes for each row execute function public.touch_updated_at();
create trigger t_addons_updated before update on public.gift_box_addons for each row execute function public.touch_updated_at();
create trigger t_pay_updated before update on public.payment_methods for each row execute function public.touch_updated_at();
create trigger t_orders_updated before update on public.orders for each row execute function public.touch_updated_at();

-- ===== seed =====
insert into public.categories (name, slug, description, sort_order) values
  ('Chocolates','chocolates','Small-batch handcrafted chocolate bars, truffles and blossoms.',1),
  ('Dry Fruits','dry-fruits','Hand-sorted nuts and dried fruit, packed fresh.',2),
  ('Gift Boxes','gift-boxes','Curated and build-your-own gifting boxes.',3),
  ('Custom Chocolates','custom-chocolates','Chocolate made exactly the way you like it.',4);

insert into public.products (name, slug, short_description, description, price, category_id, images, ingredients, net_quantity, is_featured, sort_order)
select v.name, v.slug, v.short_desc, v.descr, v.price, c.id, array[v.img], v.ingredients, v.qty, v.featured, v.ord
from (values
  ('Dark Chocolate With Walnuts','dark-chocolate-walnuts','Deep 62% dark chocolate studded with walnut halves.','Deep 62% dark chocolate, slowly tempered and finished with toasted California walnut halves.',450,'chocolates','/__l5e/assets-v1/3bef17ac-156d-44f2-8333-b6f7a59dc369/nut-chocolate.jpg','Cocoa mass, cane sugar, cocoa butter, walnuts','100 g',true,1),
  ('Milk Chocolate With Almonds','milk-chocolate-almonds','Creamy milk chocolate with whole roasted almonds.','A gentle, creamy milk chocolate bar with whole roasted almonds in every square.',450,'chocolates','/__l5e/assets-v1/0fc7eddc-d1ed-4f06-9e3d-4d0168c89984/almond-bar.jpg','Cocoa mass, milk solids, cane sugar, cocoa butter, almonds','100 g',true,2),
  ('Crispy Rice Chocolate Bar','crispy-rice-chocolate-bar','Milk chocolate with a light, crackling rice crunch.','Milk chocolate folded with puffed rice for a light, crackling bite.',450,'chocolates','/__l5e/assets-v1/7b5a3145-0784-461b-9e5d-ba23452eb7ec/rice-bar.jpg','Cocoa mass, milk solids, cane sugar, puffed rice','100 g',false,3),
  ('Chocolate Truffle Box','chocolate-truffle-box','A box of hand-rolled ganache truffles.','Hand-rolled ganache truffles, finished the same day they are poured.',650,'chocolates','/__l5e/assets-v1/6834f63f-b1b1-4021-b15b-0be5d820a639/truffle-box.jpg','Cocoa mass, cream, cane sugar, cocoa butter','12 pieces',true,4),
  ('White & Dark Truffle Blossoms','white-dark-truffle-blossoms','Flower-shaped truffles in white and dark chocolate.','Delicate flower-shaped truffles moulded in white and dark chocolate.',750,'chocolates','/__l5e/assets-v1/9f2989ab-6ef1-4fbc-b7f9-2f19524c54de/white-chocolates.jpg','Cocoa butter, milk solids, cocoa mass, cane sugar','9 pieces',true,5),
  ('Premium Whole Almonds','premium-whole-almonds','Plump, hand-sorted whole almonds.','Plump whole almonds, hand-sorted and packed fresh in small lots.',520,'dry-fruits','/__l5e/assets-v1/3e0f6678-e26c-4cc0-900b-87dd39828034/almonds.webp','Almonds','250 g',false,1),
  ('Jumbo Whole Cashews','jumbo-whole-cashews','Large, creamy whole cashews.','Large, creamy W240 grade whole cashews.',620,'dry-fruits','/__l5e/assets-v1/8857a79c-f5cc-4a60-a072-b095faa19860/cashews.webp','Cashew nuts','250 g',false,2),
  ('California Walnut Halves','california-walnut-halves','Light, sweet walnut halves.','Light-coloured, sweet walnut halves with no bitterness.',680,'dry-fruits','/__l5e/assets-v1/3a67e2ce-72cb-47c2-8120-361fa533e053/walnuts.webp','Walnut kernels','250 g',false,3),
  ('Golden Seedless Raisins','golden-seedless-raisins','Soft, sun-dried golden raisins.','Soft golden raisins, sun-dried and seedless.',340,'dry-fruits','/__l5e/assets-v1/a2e98a29-7948-4de5-9acf-d446ec66dea9/raisins.webp','Raisins','250 g',false,4)
) as v(name,slug,short_desc,descr,price,cat,img,ingredients,qty,featured,ord)
join public.categories c on c.slug = v.cat;

insert into public.customization_options (group_key, group_label, name, price_delta, sort_order) values
  ('base','Chocolate Base','Semi-Dark Chocolate',0,1),
  ('base','Chocolate Base','White Chocolate',0,2),
  ('base','Chocolate Base','Dark 70%',20,3),
  ('addin','Add-ins','Almonds',30,1),
  ('addin','Add-ins','Cashews',35,2),
  ('addin','Add-ins','Walnuts',40,3),
  ('addin','Add-ins','Raisins',25,4),
  ('addin','Add-ins','Mixed Seeds',30,5);

insert into public.gift_box_sizes (name, capacity, price, sort_order) values
  ('6 Pieces',6,450,1), ('9 Pieces',9,650,2), ('12 Pieces',12,850,3);

insert into public.gift_box_addons (name, description, price, allows_message, sort_order) values
  ('Handwritten Message','A personal note on Célunor card stock.',50,true,1),
  ('Premium Packaging','Rigid box, ribbon and wax seal.',150,false,2),
  ('Dry Fruit Pouch','A 100 g pouch of assorted dry fruits.',250,false,3);

insert into public.payment_methods (code, name, instructions, sort_order) values
  ('cod','Cash on Delivery','Pay in cash when your order arrives.',1),
  ('upi','UPI','Pay by UPI. Payment details are shared after you place the order.',2),
  ('whatsapp','Order on WhatsApp','Complete your order over WhatsApp with our team.',3);

insert into public.site_settings (key, value, label, group_key) values
  ('business_name','Célunor','Business name','contact'),
  ('tagline','Crafted for the moments worth savouring.','Brand tagline','general'),
  ('announcement','Free delivery on orders above ₹1,500','Announcement bar','general'),
  ('delivery_message','PAN India delivery in 3–6 working days.','Delivery message','general'),
  ('delivery_charge','80','Delivery charge (₹)','general'),
  ('free_delivery_above','1500','Free delivery above (₹)','general'),
  ('phone','+91 90000 00000','Phone','contact'),
  ('whatsapp','919000000000','WhatsApp number (with country code, digits only)','contact'),
  ('email','hello@celunor.com','Email','contact'),
  ('address','','Address','contact'),
  ('city','Mumbai','City','contact'),
  ('state','Maharashtra','State','contact'),
  ('pincode','','Pincode','contact'),
  ('instagram','','Instagram URL','contact'),
  ('business_hours','Mon–Sat, 10am – 7pm','Business hours','contact'),
  ('footer_note','Luxury handcrafted chocolates, delivered across India.','Footer note','general'),
  ('story_intro','Small batches, slow craft, honest ingredients','Our Story — headline','story'),
  ('story_body','Célunor began in a small kitchen with a simple belief — that chocolate should be made slowly, with real ingredients and a lot of patience. Every bar is tempered by hand and finished the same day it is poured.','Our Story — opening paragraph','story'),
  ('story_section_1_title','Our craft','Our Story — section 1 title','story'),
  ('story_section_1_body','Edit this section from the admin panel to tell the story of how Célunor chocolate is made.','Our Story — section 1 body','story'),
  ('story_section_2_title','Our ingredients','Our Story — section 2 title','story'),
  ('story_section_2_body','Edit this section from the admin panel to describe where your ingredients come from.','Our Story — section 2 body','story'),
  ('story_section_3_title','Our promise','Our Story — section 3 title','story'),
  ('story_section_3_body','Edit this section from the admin panel to share what your customers can expect from every box.','Our Story — section 3 body','story');
