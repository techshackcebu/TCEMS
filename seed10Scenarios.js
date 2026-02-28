import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

async function seedScenarios() {
    console.log('--- STARTING 10 SCENARIO SEED ---');
    const timestamp = Date.now();

    // Fetch MasterAdmin/Technician Profile
    const { data: profiles, error: profErr } = await supabase.from('profiles').select('*').limit(1);
    if (profErr || !profiles || profiles.length === 0) {
        console.error("No profiles found. Cannot assign tickets.");
        return;
    }
    const adminProfileId = profiles[0].id;

    // 10 Customers
    const customersData = [
        { full_name: 'Arthur Pendragon', phone: '0917-1111111', email: 'arthur@example.com' }, // Scenario 1
        { full_name: 'Bob Builder', phone: '0918-2222222', email: 'bob@example.com' },     // Scenario 2
        { full_name: 'Cathy Clumsy', phone: '0919-3333333', email: 'cathy@example.com' },    // Scenario 3
        { full_name: 'David Gamer', phone: '0920-4444444', email: 'david@example.com' },     // Scenario 4
        { full_name: 'Eve Designer', phone: '0921-5555555', email: 'eve@example.com' },       // Scenario 5
        { full_name: 'Fred Grandpa', phone: '0922-6666666', email: 'fred@example.com' },      // Scenario 6
        { full_name: 'Gina Streamer', phone: '0923-7777777', email: 'gina@example.com' },     // Scenario 7
        { full_name: 'Harry Kid', phone: '0924-8888888', email: 'harry@example.com' },        // Scenario 8
        { full_name: 'Ian Office', phone: '0925-9999999', email: 'ian@example.com' },         // Scenario 9
        { full_name: 'Julia Artist', phone: '0926-0000000', email: 'julia@example.com' }      // Scenario 10
    ];

    const { data: custRes, error: custErr } = await supabase.from('customers').insert(customersData).select();
    if (custErr) {
        console.error("Error creating customers", custErr);
        return;
    }

    // Devices mapped to the inserted customers
    const devicesData = [
        { customer_id: custRes[0].id, brand: 'Apple', model: 'MacBook Pro M2', serial_number: `A1-${timestamp}`, device_type: 'Laptop' },
        { customer_id: custRes[1].id, brand: 'Custom', model: 'ATX Rig', serial_number: `B2-${timestamp}`, device_type: 'Desktop' },
        { customer_id: custRes[2].id, brand: 'Apple', model: 'iPhone 14 Pro', serial_number: `C3-${timestamp}`, device_type: 'Others' },
        { customer_id: custRes[3].id, brand: 'Sony', model: 'PlayStation 5', serial_number: `D4-${timestamp}`, device_type: 'Console' },
        { customer_id: custRes[4].id, brand: 'Seagate', model: '2TB External HDD', serial_number: `E5-${timestamp}`, device_type: 'Others' },
        { customer_id: custRes[5].id, brand: 'Acer', model: 'Aspire 5', serial_number: `F6-${timestamp}`, device_type: 'Laptop' },
        { customer_id: custRes[6].id, brand: 'ASUS', model: 'ROG Zephyrus G14', serial_number: `G7-${timestamp}`, device_type: 'Laptop' },
        { customer_id: custRes[7].id, brand: 'Nintendo', model: 'Switch OLED', serial_number: `H8-${timestamp}`, device_type: 'Console' },
        { customer_id: custRes[8].id, brand: 'HP', model: 'ProDesk 400', serial_number: `I9-${timestamp}`, device_type: 'Desktop' },
        { customer_id: custRes[9].id, brand: 'Apple', model: 'iMac 24"', serial_number: `J0-${timestamp}`, device_type: 'Desktop' }
    ];

    const { data: devRes, error: devErr } = await supabase.from('devices').insert(devicesData).select();
    if (devErr) {
        console.error("Error creating devices", devErr);
        return;
    }

    // Repair Tickets for 10 diverse scenarios
    const ticketsData = [
        { // Scenario 1: Liquid damage (Pending)
            customer_id: custRes[0].id, device_id: devRes[0].id, intake_by: adminProfileId, assigned_to: adminProfileId,
            status: 'Pending', priority: 'High', estimated_cost: 0, actual_cost: 0, device_password: '123',
            probing_history: { occurrence: "Spilled coffee 20 mins ago", troubleshooting: "Turned off immediately", faults: ["Liquid Spilled", "No Power"] }
        },
        { // Scenario 2: Custom PC Build (Waiting for Parts)
            customer_id: custRes[1].id, device_id: devRes[1].id, intake_by: adminProfileId, assigned_to: adminProfileId,
            status: 'Waiting for Parts', priority: 'Medium', estimated_cost: 0, actual_cost: 0, device_password: 'N/A',
            probing_history: { occurrence: "New Build", troubleshooting: "Needs assembly", faults: ["Upgrade / Assembly"] }
        },
        { // Scenario 3: Shattered Phone (Checking)
            customer_id: custRes[2].id, device_id: devRes[2].id, intake_by: adminProfileId, assigned_to: adminProfileId,
            status: 'Checking', priority: 'High', estimated_cost: 0, actual_cost: 0, device_password: '000',
            probing_history: { occurrence: "Dropped on concrete", troubleshooting: "Still rings but screen black", faults: ["Shattered Screen", "No Display"] }
        },
        { // Scenario 4: Overheating Console (Checking)
            customer_id: custRes[3].id, device_id: devRes[3].id, intake_by: adminProfileId, assigned_to: adminProfileId,
            status: 'Checking', priority: 'Medium', estimated_cost: 0, actual_cost: 0, device_password: 'N/A',
            probing_history: { occurrence: "Shuts down during intensive games", troubleshooting: "Cleared vents with air duster", faults: ["Overheating", "Loud Fan"] }
        },
        { // Scenario 5: HDD Data Recovery (Pending)
            customer_id: custRes[4].id, device_id: devRes[4].id, intake_by: adminProfileId, assigned_to: adminProfileId,
            status: 'Pending', priority: 'Low', estimated_cost: 0, actual_cost: 0, device_password: 'N/A',
            probing_history: { occurrence: "Drive making clicking noise", troubleshooting: "Stopped plugging it in", faults: ["Data Recovery", "Unrecognized Drive"] }
        },
        { // Scenario 6: Broken Laptop Hinge (Repairing)
            customer_id: custRes[5].id, device_id: devRes[5].id, intake_by: adminProfileId, assigned_to: adminProfileId,
            status: 'Repairing', priority: 'Medium', estimated_cost: 2500, actual_cost: 2500, device_password: '123',
            probing_history: { occurrence: "Closed it too hard", troubleshooting: "None", faults: ["Physical Damage", "Hinge Broken"] }
        },
        { // Scenario 7: Gaming Laptop Repaste (Done)
            customer_id: custRes[6].id, device_id: devRes[6].id, intake_by: adminProfileId, assigned_to: adminProfileId,
            status: 'Done', priority: 'Medium', estimated_cost: 1500, actual_cost: 1500, device_password: '000',
            probing_history: { occurrence: "High temps (95C+)", troubleshooting: "None", faults: ["Overheating", "Needs Maintenance"] }
        },
        { // Scenario 8: Joycon Drift (Released)
            customer_id: custRes[7].id, device_id: devRes[7].id, intake_by: adminProfileId, assigned_to: adminProfileId,
            status: 'Released', priority: 'Low', estimated_cost: 1200, actual_cost: 1200, device_password: 'N/A',
            probing_history: { occurrence: "Characters move left on their own", troubleshooting: "Recalibrated in software", faults: ["Controller Drift"] }
        },
        { // Scenario 9: Desktop No Power - Dead PSU (Repairing)
            customer_id: custRes[8].id, device_id: devRes[8].id, intake_by: adminProfileId, assigned_to: adminProfileId,
            status: 'Repairing', priority: 'High', estimated_cost: 3500, actual_cost: 3500, device_password: '000',
            probing_history: { occurrence: "Power outage yesterday, won't turn on today", troubleshooting: "Changed cord, bypass UPS", faults: ["No Power"] }
        },
        { // Scenario 10: Virus/Malware Removal (Done)
            customer_id: custRes[9].id, device_id: devRes[9].id, intake_by: adminProfileId, assigned_to: adminProfileId,
            status: 'Done', priority: 'Low', estimated_cost: 1000, actual_cost: 1000, device_password: '000',
            probing_history: { occurrence: "Popups everywhere, very slow", troubleshooting: "Ran Windows Defender, found nothing", faults: ["Malware Infection", "Slow Performance"] }
        }
    ];

    const { error: ticketErr } = await supabase.from('repair_tickets').insert(ticketsData);
    if (ticketErr) {
        console.error("Error creating tickets", ticketErr);
        return;
    }

    console.log('=== 10 SCENARIOS SUCCESSFULLY GENERATED ===');
    console.log('You can now see them in your Tracking, Repair Tickets, and Dashboard pages.');
}

seedScenarios().catch(console.error);
