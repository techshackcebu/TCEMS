-- Execute this in the Supabase SQL Editor to make sure all relational tables can be read
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read customers" ON public.customers;
CREATE POLICY "Public read customers" ON public.customers FOR
SELECT USING (true);
DROP POLICY IF EXISTS "Staff can manage customers" ON public.customers;
CREATE POLICY "Staff can manage customers" ON public.customers FOR ALL USING (true);
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read devices" ON public.devices;
CREATE POLICY "Public read devices" ON public.devices FOR
SELECT USING (true);
DROP POLICY IF EXISTS "Staff can manage devices" ON public.devices;
CREATE POLICY "Staff can manage devices" ON public.devices FOR ALL USING (true);
ALTER TABLE public.repair_tickets ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read repair_tickets" ON public.repair_tickets;
CREATE POLICY "Public read repair_tickets" ON public.repair_tickets FOR
SELECT USING (true);
DROP POLICY IF EXISTS "Staff can manage repair_tickets" ON public.repair_tickets;
CREATE POLICY "Staff can manage repair_tickets" ON public.repair_tickets FOR ALL USING (true);