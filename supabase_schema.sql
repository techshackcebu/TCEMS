-- TechShack Operations System (TCEMS) 
-- Supabase Schema for Roles, Employees, and Intake
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- ROLES TABLE
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
-- EMPLOYEES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role_id INTEGER REFERENCES public.roles(id),
    is_active BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    email TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- DEVICES TABLE (Owned by Customers)
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
    technician_notes TEXT,
    customer_fault_report TEXT,
    accessories TEXT [],
    -- Array of accessories (Charger, Bag, etc.)
    photos TEXT [],
    -- Array of image URLs from Supabase Storage
    status TEXT DEFAULT 'Pending' CHECK (
        status IN (
            'Pending',
            'In Progress',
            'Waiting for Parts',
            'Done',
            'Released',
            'Cancelled'
        )
    ),
    priority TEXT DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    estimated_cost DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- INVENTORY (Parts)
CREATE TABLE IF NOT EXISTS public.inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku TEXT UNIQUE,
    part_name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER DEFAULT 0,
    cost_price DECIMAL(10, 2),
    selling_price DECIMAL(10, 2),
    low_stock_threshold INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_tickets ENABLE ROW LEVEL SECURITY;
-- Basic Policies (Admin & Staff view)
CREATE POLICY "Public profiles are visible to everyone" ON public.profiles FOR
SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR
UPDATE USING (auth.uid() = id);
CREATE POLICY "Staff can view all tickets" ON public.repair_tickets FOR
SELECT USING (true);