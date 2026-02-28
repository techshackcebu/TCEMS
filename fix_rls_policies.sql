-- FIX: Missing RLS Insert/Update Policies across the application
-- Run this in your Supabase SQL Editor
-- 1. Profiles
CREATE POLICY "Staff can update own profile" ON public.profiles FOR
UPDATE USING (auth.uid() = id);
-- 2. Customers
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read customers" ON public.customers FOR
SELECT USING (true);
CREATE POLICY "Staff can insert customers" ON public.customers FOR
INSERT WITH CHECK (true);
CREATE POLICY "Staff can update customers" ON public.customers FOR
UPDATE USING (true);
-- 3. Devices
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read devices" ON public.devices FOR
SELECT USING (true);
CREATE POLICY "Staff can insert devices" ON public.devices FOR
INSERT WITH CHECK (true);
CREATE POLICY "Staff can update devices" ON public.devices FOR
UPDATE USING (true);
-- 4. Repair Tickets
CREATE POLICY "Staff can insert tickets" ON public.repair_tickets FOR
INSERT WITH CHECK (true);
CREATE POLICY "Staff can update tickets" ON public.repair_tickets FOR
UPDATE USING (true);
-- 5. Diagnostic Results
CREATE POLICY "Staff can insert diagnostics" ON public.diagnostic_results FOR
INSERT WITH CHECK (true);
CREATE POLICY "Staff can update diagnostics" ON public.diagnostic_results FOR
UPDATE USING (true);
-- 6. Parts Inquiry
CREATE POLICY "Staff can insert parts" ON public.parts_inquiry FOR
INSERT WITH CHECK (true);
CREATE POLICY "Staff can update parts" ON public.parts_inquiry FOR
UPDATE USING (true);
-- 7. Payments
CREATE POLICY "Staff can insert payments" ON public.payments FOR
INSERT WITH CHECK (true);
CREATE POLICY "Staff can update payments" ON public.payments FOR
UPDATE USING (true);
-- 8. Attendance
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read attendance" ON public.attendance FOR
SELECT USING (true);
CREATE POLICY "Staff can insert attendance" ON public.attendance FOR
INSERT WITH CHECK (true);
-- 9. Investors
CREATE POLICY "Staff can insert investors" ON public.investors FOR
INSERT WITH CHECK (true);
CREATE POLICY "Staff can update investors" ON public.investors FOR
UPDATE USING (true);
-- 10. Inventory
CREATE POLICY "Staff can insert products" ON public.inventory_products FOR
INSERT WITH CHECK (true);
CREATE POLICY "Staff can update products" ON public.inventory_products FOR
UPDATE USING (true);
CREATE POLICY "Staff can insert services" ON public.inventory_services FOR
INSERT WITH CHECK (true);
CREATE POLICY "Staff can update services" ON public.inventory_services FOR
UPDATE USING (true);