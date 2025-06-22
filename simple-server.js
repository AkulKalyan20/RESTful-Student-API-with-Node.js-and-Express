const http = require('http');

// Create a simple server that logs all requests
const server = http.createServer((req, res) => {
    console.log(`\n=== New Request ===`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    
    let body = [];
    req.on('data', chunk => {
        body.push(chunk);
    }).on('end', () => {
        if (body.length > 0) {
            try {
                const data = Buffer.concat(body).toString();
                console.log('Body:', JSON.stringify(JSON.parse(data), null, 2));
            } catch (e) {
                console.log('Body:', Buffer.concat(body).toString());
            }
        }
        
        // Send a simple response
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
            success: true,
            message: 'Request received',
            method: req.method,
            path: req.url,
            timestamp: new Date().toISOString()
        }, null, 2));
    });
});

const PORT = 3001;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Test server running at http://localhost:${PORT}`);
    console.log('Try making requests to this server to see the request details');
    console.log('Example: curl http://localhost:3001/api/test');
});

// Handle server errors
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please free the port or use a different port.`);
    } else {
        console.error('Server error:', error);
    }
});
