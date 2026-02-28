import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function seedData() {
    console.log('--- STARTING GLOBAL SYSTEM SEED ---');
    const timestamp = Date.now();

    // 1. Fetch MasterAdmin/Technician Profile
    const { data: profiles, error: profErr } = await supabase.from('profiles').select('*').limit(3);
    if (profErr || !profiles || profiles.length === 0) {
        console.error("No profiles found. Skipping seed.");
        return;
    }
    const adminProfileId = profiles[0].id; // Assign to first user

    // 3. Seed Investors
    console.log('Seeding Investors...');
    const investors = [
        { name: `Dr. John Doe ${timestamp}`, investment: 150000, passive_share: 12, term_share: 25, total_payout: 45000, running_payout: 3500, status: 'Active' },
        { name: `Tech Capital Inc. ${timestamp}`, investment: 500000, passive_share: 15, term_share: 30, total_payout: 120000, running_payout: 8900, status: 'Active' }
    ];
    await supabase.from('investors').insert(investors);

    // 4. Seed Inventory Products
    console.log('Seeding Inventory Products...');
    const products = [
        { sku: `OLED-${timestamp}`, name: 'iPhone 13 Pro Max OLED Screen', category: 'Parts', cost: 4500, price: 6500, stocks: 5, supplier: 'Cebu GadgetHub' },
        { sku: `CHARGER-${timestamp}`, name: 'Legion 5 230W Charger', category: 'Accessories', cost: 1800, price: 3000, stocks: 12, supplier: 'Lazada Direct' },
        { sku: `PASTE-${timestamp}`, name: 'Arctic MX-4 Thermal Paste (4g)', category: 'Consumables', cost: 350, price: 800, stocks: 50, supplier: 'PC Express' }
    ];
    await supabase.from('inventory_products').insert(products);

    // 5. Seed Inventory Services
    console.log('Seeding Inventory Services...');
    const services = [
        { name: `MacBook Board Level Repair ${timestamp}`, category: 'Logic Board', price: 8500, technician_payout: 2500 },
        { name: `Gaming Laptop Deep Clean + Repaste ${timestamp}`, category: 'Maintenance', price: 1500, technician_payout: 500 },
        { name: `Smartphone Screen Refurbishing ${timestamp}`, category: 'Mobile', price: 2500, technician_payout: 800 }
    ];
    await supabase.from('inventory_services').insert(services);

    // 6. Seed Customers & Devices
    console.log('Seeding Customers & Devices...');
    const custRes = await supabase.from('customers').insert([
        { full_name: `Mark Reyes ${timestamp}`, phone: `0917-${timestamp.toString().slice(-7)}`, email: `mark${timestamp}@example.com` },
        { full_name: `Sarah Chua ${timestamp}`, phone: `0918-${timestamp.toString().slice(-7)}`, email: `sarah${timestamp}@example.com` },
        { full_name: `David Lim ${timestamp}`, phone: `0999-${timestamp.toString().slice(-7)}`, email: `david${timestamp}@example.com` }
    ]).select();

    if (custRes.error) {
        console.error("Customer seed error", custRes.error);
        return;
    }

    const c1 = custRes.data[0].id;
    const c2 = custRes.data[1].id;
    const c3 = custRes.data[2].id;

    const devRes = await supabase.from('devices').insert([
        { customer_id: c1, brand: 'Apple', model: 'MacBook Pro M1 2020', serial_number: `C02FR12${timestamp}`, device_type: 'Laptop' },
        { customer_id: c2, brand: 'Sony', model: 'PlayStation 5', serial_number: `S01-${timestamp}`, device_type: 'Console' },
        { customer_id: c3, brand: 'Lenovo', model: 'Legion Slim 7i', serial_number: `LN-${timestamp}`, device_type: 'Laptop' }
    ]).select();

    const d1 = devRes.data[0].id;
    const d2 = devRes.data[1].id;
    const d3 = devRes.data[2].id;

    // 7. Seed Repair Tickets
    console.log('Seeding Repair Tickets...');
    const ticketRes = await supabase.from('repair_tickets').insert([
        {
            customer_id: c1, device_id: d1, intake_by: adminProfileId, assigned_to: adminProfileId,
            status: 'Pending', priority: 'High', estimated_cost: 0, actual_cost: 0, device_password: '123',
            probing_history: { occurrence: "Yesterday", troubleshooting: "SMC Reset done", faults: ["No power", "Overheating"] }
        },
        {
            customer_id: c2, device_id: d2, intake_by: adminProfileId, assigned_to: adminProfileId,
            status: 'Testing (L2)', priority: 'High', estimated_cost: 0, actual_cost: 0,
            probing_history: { occurrence: "Black screen while gaming", faults: ["No Display"] }
        },
        {
            customer_id: c3, device_id: d3, intake_by: adminProfileId, assigned_to: adminProfileId,
            status: 'Checking', priority: 'Medium', estimated_cost: 0, actual_cost: 0,
            probing_history: { occurrence: "Random shutdowns", faults: ["Sudden Shutdown"] }
        }
    ]).select();

    if (ticketRes.error) {
        console.error("Ticket error", ticketRes.error);
        return;
    }

    const t1 = ticketRes.data[0].id;
    const t2 = ticketRes.data[1].id;
    const t3 = ticketRes.data[2].id;

    // 8. Add Diagnostic Data to Ticket 1 (Done state)
    console.log('Seeding Diagnostics...');
    await supabase.from('diagnostic_results').insert([
        { ticket_id: t1, phase_name: 'Level 1: Hardware Integrity', sub_phase: 'Motherboard', status: 'Failed', notes: 'Short on PPBUS_G3H. U2800 IC blown.' },
        { ticket_id: t1, phase_name: 'Level 2: Software/Logic', sub_phase: 'OS Boot Test', status: 'Good', notes: 'Boots after board repair.' }
    ]);

    // Update Expert View telemetry for T1
    await supabase.from('parts_inquiry').insert([
        { ticket_id: t1, part_name: 'ISL9240 PMIC', cost_price: 1500, selling_price: 2500, status: 'Ordered', inquirer_id: adminProfileId },
        { ticket_id: t2, part_name: 'PS5 HDMI Port Retimer IC', cost_price: 800, selling_price: 1500, status: 'Found', inquirer_id: adminProfileId }
    ]);

    // 10. Seed Payments
    console.log('Seeding Payments...');
    await supabase.from('payments').insert([
        { ticket_id: t1, amount_paid: 9000, payment_type: 'Full', payment_method: 'GCash', received_by: adminProfileId },
        { ticket_id: t2, amount_paid: 2000, payment_type: 'Half', payment_method: 'Cash', received_by: adminProfileId }
    ]);

    // Update Payment History inside the T1 (Done) ticket jsonb
    await supabase.from('repair_tickets').update({
        probing_history: {
            ...ticketRes.data[0].probing_history,
            expert_data: {
                diagnosis: 'Replaced ISL9240 IC and cleared short on main rail.',
                eta: 'Ready for pickup',
                laborPrice: 6500,
                parts: [{ name: 'ISL9240 PMIC', price: 2500 }]
            },
            payment_history: {
                total_paid: 9000,
                history: [
                    { amount: 9000, method: 'GCash', type: 'Full', date: new Date().toISOString() }
                ]
            },
            payment_status: 'Paid'
        },
        status: 'Done'
    }).eq('id', t1);

    // 11. Seed Attendance
    console.log('Seeding Attendance for Kiosk...');
    await supabase.from('attendance').insert([
        { employee_id: adminProfileId, action: 'CLOCK_IN', created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
        { employee_id: adminProfileId, action: 'LUNCH_OUT', created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
        { employee_id: adminProfileId, action: 'LUNCH_IN', created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() }
    ]);

    console.log('=== SEED COMPLETE! ===');
}

seedData().catch(console.error);
