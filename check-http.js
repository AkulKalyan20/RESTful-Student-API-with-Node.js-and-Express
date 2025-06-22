const http = require('http');

console.log('Testing HTTP request...');

const req = http.request('http://www.google.com', (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log('Response Headers:', JSON.stringify(res.headers, null, 2));
    
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log(`Received ${data.length} bytes of data`);
        console.log('First 100 characters of response:');
        console.log(data.substring(0, 100) + '...');
    });
});

req.on('error', (error) => {
    console.error('Error making request:', error);
});

req.end();
