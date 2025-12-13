const http = require('http');

const postRequest = (data) => {
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

console.log("Test 1: Missing Password");
const missingPassword = JSON.stringify({
    username: "testuser",
    email: "test@example.com"
});
postRequest(missingPassword);

setTimeout(() => {
    console.log("\nTest 2: Valid Data");
    // distinct username/email to avoid duplication error if run multiple times
    const validData = JSON.stringify({
        username: "testuser_" + Date.now(),
        email: "test_" + Date.now() + "@example.com",
        password: "password123"
    });
    postRequest(validData);
}, 1000);
