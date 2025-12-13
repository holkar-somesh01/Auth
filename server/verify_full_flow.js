const http = require('http');

let cookieToken = null;
let userId = null;

const request = (path, method, data, checkCookie = false) => {
    return new Promise((resolve) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api/auth' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data ? Buffer.byteLength(data) : 0,
            },
        };

        if (cookieToken) {
            options.headers['Cookie'] = `token=${cookieToken}`;
        }

        const req = http.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            res.on('end', () => {
                console.log(`\n--- ${method} ${path} ---`);
                console.log(`Status: ${res.statusCode}`);
                if (responseData) console.log('Response:', responseData);

                if (checkCookie && res.headers['set-cookie']) {
                    const cookies = res.headers['set-cookie'][0];
                    console.log("Set-Cookie Header:", cookies);
                    const match = cookies.match(/token=([^;]+)/);
                    if (match) {
                        cookieToken = match[1];
                        console.log("Cookie Token captured:", cookieToken);
                    }
                }
                resolve(responseData ? JSON.parse(responseData) : {});
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
            resolve({});
        });

        if (data) req.write(data);
        req.end();
    });
};

const runTests = async () => {
    const timestamp = Date.now();
    const email = `fullflow_${timestamp}@example.com`;

    // 1. Register
    const regData = JSON.stringify({
        username: `user_${timestamp}`,
        email: email,
        password: "password123",
        role: "user"
    });
    const regRes = await request('/register', 'POST', regData);
    if (!regRes.user) return;
    userId = regRes.user.id;

    // 2. Login
    const loginData = JSON.stringify({
        email: email,
        password: "password123"
    });
    await request('/login', 'POST', loginData, true);

    // 3. Update Profile (Protected Route using Cookie)
    const updateData = JSON.stringify({
        username: `updated_user_${timestamp}`
    });
    // Update Profile is at /api/auth/profile ?? No wait verify authRoutes
    // router.put('/profile', [verifyToken], controller.updateProfile);
    // Prefix is /api/auth
    await request('/profile', 'PUT', updateData);

    // 4. Forgot Password 
    // This might fail due to SMTP config, but we check if it hits the controller
    const forgotData = JSON.stringify({
        email: email
    });
    await request('/forgot-password', 'POST', forgotData);

};

runTests();
