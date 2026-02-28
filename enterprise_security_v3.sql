-- TCEMS Advanced Security & RLS (v3.0 - Enterprise Hardening)
-- Execute this to lock the system for production deployment
-- 1. Reset Policies
DROP POLICY IF EXISTS "Public read customers" ON public.customers;
DROP POLICY IF EXISTS "Staff can manage customers" ON public.customers;
DROP POLICY IF EXISTS "Public read devices" ON public.devices;
DROP POLICY IF EXISTS "Staff can manage devices" ON public.devices;
DROP POLICY IF EXISTS "Public read repair_tickets" ON public.repair_tickets;
DROP POLICY IF EXISTS "Staff can manage repair_tickets" ON public.repair_tickets;
DROP POLICY IF EXISTS "Public profiles are visible to everyone" ON public.profiles;
DROP POLICY IF EXISTS "Staff can view all tickets" ON public.repair_tickets;
DROP POLICY IF EXISTS "Staff can view all diagnostics" ON public.diagnostic_results;
DROP POLICY IF EXISTS "Staff can view all inquiries" ON public.parts_inquiry;
DROP POLICY IF EXISTS "Staff can view all payments" ON public.payments;
-- 2. Profiles (Staff)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles read by authenticated staff" ON public.profiles FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage profiles" ON public.profiles FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM public.profiles p
            JOIN public.roles r ON p.role_id = r.id
        WHERE p.id = auth.uid()
            AND r.name = 'Admin'
    )
);
-- 3. Customers & Devices (Authorized Access Only)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read/write customers" ON public.customers FOR ALL TO authenticated USING (true);
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can read/write devices" ON public.devices FOR ALL TO authenticated USING (true);
-- 4. Repair Tickets
ALTER TABLE public.repair_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff can manage tickets" ON public.repair_tickets FOR ALL TO authenticated USING (true);
-- 5. Financials (Strict Isolation)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins and HR can view payments" ON public.payments FOR
SELECT TO authenticated USING (
        EXISTS (
            SELECT 1
            FROM public.profiles p
                JOIN public.roles r ON p.role_id = r.id
            WHERE p.id = auth.uid()
                AND r.name IN ('Admin', 'HR', 'Operations Manager')
        )
    );
CREATE POLICY "Staff can insert payments (Sales)" ON public.payments FOR
INSERT TO authenticated WITH CHECK (true);
-- 6. Inventory Hub
ALTER TABLE public.inventory_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth users can view inventory" ON public.inventory_products FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Ops and Admin manage inventory" ON public.inventory_products FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM public.profiles p
            JOIN public.roles r ON p.role_id = r.id
        WHERE p.id = auth.uid()
            AND r.name IN ('Admin', 'Operations Manager')
    )
);