const http = require('http');

const postRequest = (data, label) => {
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/auth/register',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data),
        },
    };

    const req = http.request(options, (res) => {
        let responseData = '';
        res.on('data', (chunk) => {
            responseData += chunk;
        });
        res.on('end', () => {
            console.log(`\n--- ${label} ---`);
            console.log(`Status: ${res.statusCode}`);
            console.log('Response:', responseData);
        });
    });

    req.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
    });

    req.write(data);
    req.end();
};

const uniqueTime = Date.now();
const email = `duplicate_test_${uniqueTime}@example.com`;

console.log("Starting Duplicate Email Test...");

// 1. First Registration (Should Success)
const user1 = JSON.stringify({
    username: `user1_${uniqueTime}`,
    email: email,
    password: "password123",
    role: "user"
});
postRequest(user1, "Register First User");

// 2. Second Registration with SAME email (Should Fail)
setTimeout(() => {
    const user2 = JSON.stringify({
        username: `user2_${uniqueTime}`,
        email: email, // SAME EMAIL
        password: "password456",
        role: "admin" // Different role, shouldn't matter
    });
    postRequest(user2, "Register Duplicate Email");
}, 2000);
