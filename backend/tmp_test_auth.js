const axios = require('axios');

const API_URL = 'http://localhost:5000/api';
const testUser = {
    name: `Test User ${Date.now()}`,
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    role: 'farmer'
};

async function runTests() {
    let token = '';

    try {
        console.log('1. Testing Signup...');
        const signupRes = await axios.post(`${API_URL}/auth/signup`, testUser);
        console.log('Signup Response:', signupRes.data);

        console.log('\n2. Testing Login...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('Login Response:', loginRes.data);
        token = loginRes.data.token;

        console.log('\n3. Testing Protected Profile Route (/api/auth/profile)...');
        const profileRes = await axios.get(`${API_URL}/auth/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Profile Response:', profileRes.data);

        console.log('\n4. Testing Protected Transport Route (/api/transport/book)...');
        const transportRes = await axios.post(`${API_URL}/transport/book`, {
            farmerName: testUser.name,
            crop: 'Wheat',
            quantity: '100 kg',
            pickupLocation: 'Farm 1',
            phone: '1234567890',
            preferredDate: '2026-03-10'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Transport Response:', transportRes.data);

        console.log('\n5. Testing Protected Community Route (/api/posts)...');
        const postRes = await axios.post(`${API_URL}/posts`, {
            title: 'New Crop Variety',
            content: 'I tried a new wheat variety, and the yield is amazing!'
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Community Post Response:', postRes.data);

        console.log('\n✅ All tests passed successfully!');
    } catch (error) {
        console.error('\n❌ Test failed:');
        if (error.response) {
            console.error(error.response.status, error.response.data);
        } else {
            console.error(error.message);
        }
    }
}

runTests();
