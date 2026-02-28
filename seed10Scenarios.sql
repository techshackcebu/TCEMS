-- 10 Dummy Customer Scenarios
-- Copy and paste this into your Supabase Dashboard SQL Editor
DO $$
DECLARE -- Admin User ID to assign tickets
    v_admin_id UUID;
-- Variables to hold generated returning IDs
c1 UUID;
c2 UUID;
c3 UUID;
c4 UUID;
c5 UUID;
c6 UUID;
c7 UUID;
c8 UUID;
c9 UUID;
c10 UUID;
d1 UUID;
d2 UUID;
d3 UUID;
d4 UUID;
d5 UUID;
d6 UUID;
d7 UUID;
d8 UUID;
d9 UUID;
d10 UUID;
BEGIN -- Get the first available profile/admin to assign the tickets
SELECT id INTO v_admin_id
FROM public.profiles
LIMIT 1;
IF v_admin_id IS NULL THEN RAISE EXCEPTION 'No profiles found to assign tickets. Please add an employee first.';
END IF;
-----------------------------------
-- 1. Liquid Spill MacBook (Pending) --
-----------------------------------
INSERT INTO public.customers (full_name, phone, email)
VALUES (
        'Arthur Pendragon',
        '0917-1111111',
        'arthur@example.com'
    )
RETURNING id INTO c1;
INSERT INTO public.devices (
        customer_id,
        brand,
        model,
        serial_number,
        device_type
    )
VALUES (
        c1,
        'Apple',
        'MacBook Pro M2',
        'A1-' || gen_random_uuid(),
        'Laptop'
    )
RETURNING id INTO d1;
INSERT INTO public.repair_tickets (
        customer_id,
        device_id,
        intake_by,
        assigned_to,
        status,
        priority,
        device_password,
        probing_history
    )
VALUES (
        c1,
        d1,
        v_admin_id,
        v_admin_id,
        'Pending',
        'High',
        '123',
        '{"occurrence": "Spilled coffee 20 mins ago", "troubleshooting": "Turned off immediately", "faults": ["Liquid Spilled", "No Power"]}'
    );
-------------------------------------------
-- 2. Custom PC Build (Waiting for Parts) --
-------------------------------------------
INSERT INTO public.customers (full_name, phone, email)
VALUES ('Bob Builder', '0918-2222222', 'bob@example.com')
RETURNING id INTO c2;
INSERT INTO public.devices (
        customer_id,
        brand,
        model,
        serial_number,
        device_type
    )
VALUES (
        c2,
        'Custom',
        'ATX Rig',
        'B2-' || gen_random_uuid(),
        'Desktop'
    )
RETURNING id INTO d2;
INSERT INTO public.repair_tickets (
        customer_id,
        device_id,
        intake_by,
        assigned_to,
        status,
        priority,
        device_password,
        probing_history
    )
VALUES (
        c2,
        d2,
        v_admin_id,
        v_admin_id,
        'Waiting for Parts',
        'Medium',
        'N/A',
        '{"occurrence": "New Build", "troubleshooting": "Needs assembly", "faults": ["Upgrade / Assembly"]}'
    );
-------------------------------------
-- 3. Shattered Screen (Checking)  --
-------------------------------------
INSERT INTO public.customers (full_name, phone, email)
VALUES (
        'Cathy Clumsy',
        '0919-3333333',
        'cathy@example.com'
    )
RETURNING id INTO c3;
INSERT INTO public.devices (
        customer_id,
        brand,
        model,
        serial_number,
        device_type
    )
VALUES (
        c3,
        'Apple',
        'iPhone 14 Pro',
        'C3-' || gen_random_uuid(),
        'Others'
    )
RETURNING id INTO d3;
INSERT INTO public.repair_tickets (
        customer_id,
        device_id,
        intake_by,
        assigned_to,
        status,
        priority,
        device_password,
        probing_history
    )
VALUES (
        c3,
        d3,
        v_admin_id,
        v_admin_id,
        'Checking',
        'High',
        '0000',
        '{"occurrence": "Dropped on concrete", "troubleshooting": "Still rings but screen black", "faults": ["Shattered Screen", "No Display"]}'
    );
-------------------------------------
-- 4. Overheating PS5 (Checking)   --
-------------------------------------
INSERT INTO public.customers (full_name, phone, email)
VALUES (
        'David Gamer',
        '0920-4444444',
        'david@example.com'
    )
RETURNING id INTO c4;
INSERT INTO public.devices (
        customer_id,
        brand,
        model,
        serial_number,
        device_type
    )
VALUES (
        c4,
        'Sony',
        'PlayStation 5',
        'D4-' || gen_random_uuid(),
        'Console'
    )
RETURNING id INTO d4;
INSERT INTO public.repair_tickets (
        customer_id,
        device_id,
        intake_by,
        assigned_to,
        status,
        priority,
        device_password,
        probing_history
    )
VALUES (
        c4,
        d4,
        v_admin_id,
        v_admin_id,
        'Checking',
        'Medium',
        'N/A',
        '{"occurrence": "Shuts down during intensive games", "troubleshooting": "Cleared vents with air duster", "faults": ["Overheating", "Loud Fan"]}'
    );
-------------------------------------
-- 5. HDD Data Recovery (Pending)  --
-------------------------------------
INSERT INTO public.customers (full_name, phone, email)
VALUES (
        'Eve Designer',
        '0921-5555555',
        'eve@example.com'
    )
RETURNING id INTO c5;
INSERT INTO public.devices (
        customer_id,
        brand,
        model,
        serial_number,
        device_type
    )
VALUES (
        c5,
        'Seagate',
        '2TB External HDD',
        'E5-' || gen_random_uuid(),
        'Others'
    )
RETURNING id INTO d5;
INSERT INTO public.repair_tickets (
        customer_id,
        device_id,
        intake_by,
        assigned_to,
        status,
        priority,
        device_password,
        probing_history
    )
VALUES (
        c5,
        d5,
        v_admin_id,
        v_admin_id,
        'Pending',
        'Low',
        'N/A',
        '{"occurrence": "Drive making clicking noise", "troubleshooting": "Stopped plugging it in", "faults": ["Data Recovery", "Unrecognized Drive"]}'
    );
-------------------------------------
-- 6. Broken Hinge (Repairing)     --
-------------------------------------
INSERT INTO public.customers (full_name, phone, email)
VALUES (
        'Fred Grandpa',
        '0922-6666666',
        'fred@example.com'
    )
RETURNING id INTO c6;
INSERT INTO public.devices (
        customer_id,
        brand,
        model,
        serial_number,
        device_type
    )
VALUES (
        c6,
        'Acer',
        'Aspire 5',
        'F6-' || gen_random_uuid(),
        'Laptop'
    )
RETURNING id INTO d6;
INSERT INTO public.repair_tickets (
        customer_id,
        device_id,
        intake_by,
        assigned_to,
        status,
        priority,
        estimated_cost,
        actual_cost,
        device_password,
        probing_history
    )
VALUES (
        c6,
        d6,
        v_admin_id,
        v_admin_id,
        'Repairing',
        'Medium',
        2500,
        2500,
        'N/A',
        '{"occurrence": "Closed it too hard", "troubleshooting": "None", "faults": ["Physical Damage", "Hinge Broken"]}'
    );
-------------------------------------
-- 7. Gaming Laptop Repaste (Done) --
-------------------------------------
INSERT INTO public.customers (full_name, phone, email)
VALUES (
        'Gina Streamer',
        '0923-7777777',
        'gina@example.com'
    )
RETURNING id INTO c7;
INSERT INTO public.devices (
        customer_id,
        brand,
        model,
        serial_number,
        device_type
    )
VALUES (
        c7,
        'ASUS',
        'ROG Zephyrus G14',
        'G7-' || gen_random_uuid(),
        'Laptop'
    )
RETURNING id INTO d7;
INSERT INTO public.repair_tickets (
        customer_id,
        device_id,
        intake_by,
        assigned_to,
        status,
        priority,
        estimated_cost,
        actual_cost,
        device_password,
        probing_history
    )
VALUES (
        c7,
        d7,
        v_admin_id,
        v_admin_id,
        'Done',
        'Medium',
        1500,
        1500,
        '0000',
        '{"occurrence": "High temps (95C+)", "troubleshooting": "None", "faults": ["Overheating", "Needs Maintenance"], "expert_data": {"eta": "Ready for pickup", "diagnosis": "Deep cleaned and replaced thermal paste with Kryonaut."}}'
    );
-------------------------------------
-- 8. Joycon Drift (Released)      --
-------------------------------------
INSERT INTO public.customers (full_name, phone, email)
VALUES ('Harry Kid', '0924-8888888', 'harry@example.com')
RETURNING id INTO c8;
INSERT INTO public.devices (
        customer_id,
        brand,
        model,
        serial_number,
        device_type
    )
VALUES (
        c8,
        'Nintendo',
        'Switch OLED',
        'H8-' || gen_random_uuid(),
        'Console'
    )
RETURNING id INTO d8;
INSERT INTO public.repair_tickets (
        customer_id,
        device_id,
        intake_by,
        assigned_to,
        status,
        priority,
        estimated_cost,
        actual_cost,
        device_password,
        probing_history
    )
VALUES (
        c8,
        d8,
        v_admin_id,
        v_admin_id,
        'Released',
        'Low',
        1200,
        1200,
        'N/A',
        '{"occurrence": "Characters move left on their own", "troubleshooting": "Recalibrated in software", "faults": ["Controller Drift"], "payment_status": "Paid"}'
    );
-------------------------------------
-- 9. Dead PSU (Repairing)         --
-------------------------------------
INSERT INTO public.customers (full_name, phone, email)
VALUES ('Ian Office', '0925-9999999', 'ian@example.com')
RETURNING id INTO c9;
INSERT INTO public.devices (
        customer_id,
        brand,
        model,
        serial_number,
        device_type
    )
VALUES (
        c9,
        'HP',
        'ProDesk 400',
        'I9-' || gen_random_uuid(),
        'Desktop'
    )
RETURNING id INTO d9;
INSERT INTO public.repair_tickets (
        customer_id,
        device_id,
        intake_by,
        assigned_to,
        status,
        priority,
        estimated_cost,
        actual_cost,
        device_password,
        probing_history
    )
VALUES (
        c9,
        d9,
        v_admin_id,
        v_admin_id,
        'Repairing',
        'High',
        3500,
        3500,
        '1234',
        '{"occurrence": "Power outage yesterday, won''t turn on today", "troubleshooting": "Changed cord, bypass UPS", "faults": ["No Power"]}'
    );
-------------------------------------
-- 10. Malware Removal (Done)      --
-------------------------------------
INSERT INTO public.customers (full_name, phone, email)
VALUES (
        'Julia Artist',
        '0926-0000000',
        'julia@example.com'
    )
RETURNING id INTO c10;
INSERT INTO public.devices (
        customer_id,
        brand,
        model,
        serial_number,
        device_type
    )
VALUES (
        c10,
        'Apple',
        'iMac 24"',
        'J0-' || gen_random_uuid(),
        'Desktop'
    )
RETURNING id INTO d10;
INSERT INTO public.repair_tickets (
        customer_id,
        device_id,
        intake_by,
        assigned_to,
        status,
        priority,
        estimated_cost,
        actual_cost,
        device_password,
        probing_history
    )
VALUES (
        c10,
        d10,
        v_admin_id,
        v_admin_id,
        'Done',
        'Low',
        1000,
        1000,
        '0000',
        '{"occurrence": "Popups everywhere, very slow", "troubleshooting": "Ran Windows Defender, found nothing", "faults": ["Malware Infection", "Slow Performance"], "payment_status": "Unpaid"}'
    );
END $$;