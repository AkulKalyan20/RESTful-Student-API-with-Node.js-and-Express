const http = require('http');

const HOST = 'localhost';
const PORT = 3000;

// Create a simple HTTP server for testing
const server = http.createServer((req, res) => {
    console.log(`Received ${req.method} request to ${req.url}`);
    
    let body = [];
    req.on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            method: req.method,
            url: req.url,
            headers: req.headers,
            body: body ? JSON.parse(body || '{}') : {}
        }, null, 2));
    });
});

// Start the test server
server.listen(PORT, HOST, () => {
    console.log(`Test server running at http://${HOST}:${PORT}`);
    
    // Test the server
    testServer();
});

// Test the server
function testServer() {
    const options = {
        hostname: HOST,
        port: PORT,
        path: '/api/health',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    
    const req = http.request(options, (res) => {
        console.log(`Status Code: ${res.statusCode}`);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            console.log('Response:', data);
            server.close();
        });
    });
    
    req.on('error', (error) => {
        console.error('Error:', error);
        server.close();
    });
    
    req.end();
}
