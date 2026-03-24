
async function testRegistrationAndAuth() {
    const API_URL = 'http://localhost:3001';
    const testUser = {
        name: 'Test Business',
        email: `test_bus_${Date.now()}@example.com`,
        password: 'password123',
        role: 'BUSINESS'
    };

    console.log('--- Testing Registration ---');
    try {
        const regRes = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const regData = await regRes.json();
        
        if (regRes.ok && regData.access_token) {
            console.log('✅ Registration returned access_token');
            
            console.log('--- Testing Authenticated Endpoint ---');
            const authRes = await fetch(`${API_URL}/notifications`, {
                headers: { Authorization: `Bearer ${regData.access_token}` }
            });
            const authData = await authRes.json();
            
            if (authRes.ok) {
                console.log('✅ Authenticated request to /notifications successful');
                console.log('Notifications count:', authData.length);
            } else {
                console.log('❌ Authenticated request failed:', authData);
            }
        } else {
            console.log('❌ Registration failed or DID NOT return access_token:', regData);
        }
    } catch (err) {
        console.error('❌ Test failed (Is backend running on 3002?):', err.message);
    }

    console.log('--- Testing Master Bypass Token ---');
    try {
        const bypassRes = await fetch(`${API_URL}/notifications`, {
            headers: { Authorization: 'Bearer MASTER_BYPASS_TOKEN' }
        });
        const bypassData = await bypassRes.json();
        
        if (bypassRes.ok) {
            console.log('✅ Master bypass request to /notifications successful');
            console.log('Bypass User notifications count:', bypassData.length);
        } else {
            console.log('❌ Master bypass test failed:', bypassData);
        }
    } catch (err) {
        console.error('❌ Master bypass test failed (Is backend running?):', err.message);
    }
}

testRegistrationAndAuth();
