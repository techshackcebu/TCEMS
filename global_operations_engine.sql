-- GLOBAL OPERATIONS ENGINE (v3.1)
-- Persistence for system-wide configuration to remove hardcoded logic
CREATE TABLE IF NOT EXISTS public.system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
-- SEED GLOBAL DEFAULT DATA
INSERT INTO public.system_config (key, value, description)
VALUES (
        'BASE_CURRENCY',
        '{"symbol": "₱", "code": "PHP"}',
        'Default display currency'
    ),
    (
        'DAILY_REVENUE_TARGET',
        '7040',
        'Baseline goal for War Room Dashboard'
    ),
    (
        'PAYROLL_BASICS',
        '{"monthly_deminimis": 2500, "base_daily_wage": 540, "regular_days_per_period": 15}',
        'TechShack standard compensation defaults'
    ),
    (
        'BRANCH_INFO',
        '{"name": "TechShack Cebu (Main)", "address": "123 Canduman St., Mandaue City, Cebu"}',
        'Global branch identity'
    );
-- RLS FOR SYSTEM CONFIG
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read config" ON public.system_config FOR
SELECT TO authenticated USING (true);
CREATE POLICY "Admin manage config" ON public.system_config FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1
        FROM public.profiles p
            JOIN public.roles r ON p.role_id = r.id
        WHERE p.id = auth.uid()
            AND r.name = 'Admin'
    )
);