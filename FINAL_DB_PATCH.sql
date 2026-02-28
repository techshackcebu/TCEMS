-- ==========================================================
-- TECHSHACK CRITICAL RLS (ROW-LEVEL SECURITY) PATCH
-- ==========================================================
-- This unlocks your database to allow Intake, Inventory, and 
-- Investors to save successfully from the application.
-- 1. Customers
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read customers" ON public.customers;
DROP POLICY IF EXISTS "Staff can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Staff can update customers" ON public.customers;
CREATE POLICY "Public read customers" ON public.customers FOR
SELECT USING (true);
CREATE POLICY "Staff can insert customers" ON public.customers FOR
INSERT WITH CHECK (true);
CREATE POLICY "Staff can update customers" ON public.customers FOR
UPDATE USING (true);
-- 2. Devices
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read devices" ON public.devices;
DROP POLICY IF EXISTS "Staff can insert devices" ON public.devices;
DROP POLICY IF EXISTS "Staff can update devices" ON public.devices;
CREATE POLICY "Public read devices" ON public.devices FOR
SELECT USING (true);
CREATE POLICY "Staff can insert devices" ON public.devices FOR
INSERT WITH CHECK (true);
CREATE POLICY "Staff can update devices" ON public.devices FOR
UPDATE USING (true);
-- 3. Repair Tickets
DROP POLICY IF EXISTS "Staff can insert tickets" ON public.repair_tickets;
DROP POLICY IF EXISTS "Staff can update tickets" ON public.repair_tickets;
CREATE POLICY "Staff can insert tickets" ON public.repair_tickets FOR
INSERT WITH CHECK (true);
CREATE POLICY "Staff can update tickets" ON public.repair_tickets FOR
UPDATE USING (true);
-- 4. Diagnostic Results
DROP POLICY IF EXISTS "Staff can insert diagnostics" ON public.diagnostic_results;
DROP POLICY IF EXISTS "Staff can update diagnostics" ON public.diagnostic_results;
CREATE POLICY "Staff can insert diagnostics" ON public.diagnostic_results FOR
INSERT WITH CHECK (true);
CREATE POLICY "Staff can update diagnostics" ON public.diagnostic_results FOR
UPDATE USING (true);
-- 5. Parts Inquiry
DROP POLICY IF EXISTS "Staff can insert parts" ON public.parts_inquiry;
DROP POLICY IF EXISTS "Staff can update parts" ON public.parts_inquiry;
CREATE POLICY "Staff can insert parts" ON public.parts_inquiry FOR
INSERT WITH CHECK (true);
CREATE POLICY "Staff can update parts" ON public.parts_inquiry FOR
UPDATE USING (true);
-- 6. Payments
DROP POLICY IF EXISTS "Staff can insert payments" ON public.payments;
DROP POLICY IF EXISTS "Staff can update payments" ON public.payments;
CREATE POLICY "Staff can insert payments" ON public.payments FOR
INSERT WITH CHECK (true);
CREATE POLICY "Staff can update payments" ON public.payments FOR
UPDATE USING (true);
-- 7. Attendance
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read attendance" ON public.attendance;
DROP POLICY IF EXISTS "Staff can insert attendance" ON public.attendance;
CREATE POLICY "Public read attendance" ON public.attendance FOR
SELECT USING (true);
CREATE POLICY "Staff can insert attendance" ON public.attendance FOR
INSERT WITH CHECK (true);
-- 8. Investors
DROP POLICY IF EXISTS "Staff can insert investors" ON public.investors;
DROP POLICY IF EXISTS "Staff can update investors" ON public.investors;
CREATE POLICY "Staff can insert investors" ON public.investors FOR
INSERT WITH CHECK (true);
CREATE POLICY "Staff can update investors" ON public.investors FOR
UPDATE USING (true);
-- 9. Inventory Products & Services
DROP POLICY IF EXISTS "Staff can insert products" ON public.inventory_products;
DROP POLICY IF EXISTS "Staff can update products" ON public.inventory_products;
DROP POLICY IF EXISTS "Staff can insert services" ON public.inventory_services;
DROP POLICY IF EXISTS "Staff can update services" ON public.inventory_services;
CREATE POLICY "Staff can insert products" ON public.inventory_products FOR
INSERT WITH CHECK (true);
CREATE POLICY "Staff can update products" ON public.inventory_products FOR
UPDATE USING (true);
CREATE POLICY "Staff can insert services" ON public.inventory_services FOR
INSERT WITH CHECK (true);
CREATE POLICY "Staff can update services" ON public.inventory_services FOR
UPDATE USING (true);