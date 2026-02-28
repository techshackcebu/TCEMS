const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBnZWdmZm52enZucG9wbGJobGxmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI2NzU1NSwiZXhwIjoyMDg3ODQzNTU1fQ.drgb48LaTN4iFWV4DRz-_mV_NQBTS5uB9LG3HJKzY0Q';
async function testPostgresMeta() {
    const url = 'https://pgegffnvzvnpoplbhllf.supabase.co/pg-meta/default/query';

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`
            },
            body: JSON.stringify({ query: 'SELECT 1 AS val' })
        });
        const text = await res.text();
        console.log('Status:', res.status);
        console.log('Response:', text);
    } catch (err) { console.error(err); }
}
testPostgresMeta();
