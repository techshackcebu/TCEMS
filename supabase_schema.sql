-- TechShack Operations System (TCEMS) 
-- Complete Unified Schema (v2.0)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ROLES
CREATE TABLE IF NOT EXISTS public.roles (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT
);
INSERT INTO public.roles (name, description)
VALUES ('Admin', 'Full system access'),
    ('HR', 'Payroll and recruitment management'),
    (
        'Technician L2',
        'Junior and hardware repair specialist'
    ),
    (
        'MasterTechnician',
        'Senior technical advisor and lead technician'
    ),
    (
        'Customer Service',
        'Front desk and intake management'
    ),
    ('Operations Manager', 'Shop and inventory lead'),
    (
        'OJT/Trainee',
        'In-training staff with limited access'
    ) ON CONFLICT (name) DO NOTHING;
-- PROFILES (Staff)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role_id INTEGER REFERENCES public.roles(id),
    kiosk_pin TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- CUSTOMERS
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- DEVICES
CREATE TABLE IF NOT EXISTS public.devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    serial_number TEXT,
    color TEXT,
    device_type TEXT CHECK (
        device_type IN ('Laptop', 'Desktop', 'Console', 'Others')
    ),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- REPAIR TICKETS
CREATE TABLE IF NOT EXISTS public.repair_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number SERIAL UNIQUE,
    customer_id UUID REFERENCES public.customers(id),
    device_id UUID REFERENCES public.devices(id),
    intake_by UUID REFERENCES public.profiles(id),
    assigned_to UUID REFERENCES public.profiles(id),
    device_password TEXT,
    probing_history JSONB,
    -- Answers to probing questions
    accessories TEXT [],
    photos TEXT [],
    status TEXT DEFAULT 'Pending' CHECK (
        status IN (
            'Pending',
            'Checking',
            'Waiting for Parts',
            'Repairing',
            'Done',
            'Released',
            'Cancelled'
        )
    ),
    priority TEXT DEFAULT 'Medium',
    estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- DIAGNOSTIC RESULTS (Multi-Phase)
CREATE TABLE IF NOT EXISTS public.diagnostic_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES public.repair_tickets(id) ON DELETE CASCADE,
    phase_name TEXT NOT NULL,
    sub_phase TEXT NOT NULL,
    status TEXT NOT NULL,
    -- 'Good', 'Failed', etc.
    notes TEXT,
    photos TEXT [],
    -- Camera button on each subphase
    technical_data JSONB,
    -- RAM/Storage detailed specs
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- PARTS INQUIRY
CREATE TABLE IF NOT EXISTS public.parts_inquiry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES public.repair_tickets(id),
    diagnostic_id UUID REFERENCES public.diagnostic_results(id),
    part_name TEXT NOT NULL,
    supplier_link TEXT,
    cost_price DECIMAL(10, 2),
    selling_price DECIMAL(10, 2),
    status TEXT DEFAULT 'Pending' CHECK (
        status IN (
            'Pending',
            'Found',
            'Sourced',
            'Ordered',
            'Unavailable'
        )
    ),
    inquirer_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES public.repair_tickets(id),
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_type TEXT CHECK (payment_type IN ('Full', 'Half', 'Custom')),
    payment_method TEXT,
    received_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parts_inquiry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
-- POLICIES
CREATE POLICY "Public profiles are visible to everyone" ON public.profiles FOR
SELECT USING (true);
CREATE POLICY "Staff can view all tickets" ON public.repair_tickets FOR
SELECT USING (true);
CREATE POLICY "Staff can view all diagnostics" ON public.diagnostic_results FOR
SELECT USING (true);
CREATE POLICY "Staff can view all inquiries" ON public.parts_inquiry FOR
SELECT USING (true);
CREATE POLICY "Staff can view all payments" ON public.payments FOR
SELECT USING (true);
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);