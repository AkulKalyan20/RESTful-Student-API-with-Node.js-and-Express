const http = require('http');

const HOST = 'localhost';
const PORT = 3000;

// Test data
const testStudent = {
    name: 'Test Student',
    email: `test.${Date.now()}@example.com`,
    age: 22,
    grade: 'B',
    courses: ['Math', 'Physics']
};

let createdStudentId = null;

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = {
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: responseData ? JSON.parse(responseData) : null
                    };
                    resolve(result);
                } catch (error) {
                    reject(new Error(`Error parsing response: ${error.message}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }
        
        req.end();
    });
}

// Test 1: Health Check
async function testHealthCheck() {
    console.log('\n=== Testing Health Check ===');
    try {
        const response = await makeRequest({
            hostname: HOST,
            port: PORT,
            path: '/api/health',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Status Code:', response.statusCode);
        console.log('Response:', JSON.stringify(response.data, null, 2));
        return response.statusCode === 200;
    } catch (error) {
        console.error('Health Check Failed:', error.message);
        return false;
    }
}

// Test 2: Create Student
async function testCreateStudent() {
    console.log('\n=== Testing Create Student ===');
    try {
        const response = await makeRequest({
            hostname: HOST,
            port: PORT,
            path: '/api/students',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, testStudent);
        
        console.log('Status Code:', response.statusCode);
        console.log('Response:', JSON.stringify(response.data, null, 2));
        
        if (response.statusCode === 201 && response.data && response.data.data && response.data.data._id) {
            createdStudentId = response.data.data._id;
            return true;
        }
        return false;
    } catch (error) {
        console.error('Create Student Failed:', error.message);
        return false;
    }
}

// Test 3: Get All Students
async function testGetAllStudents() {
    console.log('\n=== Testing Get All Students ===');
    try {
        const response = await makeRequest({
            hostname: HOST,
            port: PORT,
            path: '/api/students',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Status Code:', response.statusCode);
        console.log('Total Students:', response.data.data ? response.data.data.length : 0);
        return response.statusCode === 200;
    } catch (error) {
        console.error('Get All Students Failed:', error.message);
        return false;
    }
}

// Test 4: Get Single Student
async function testGetSingleStudent() {
    if (!createdStudentId) {
        console.log('Skipping Get Single Student - No student ID available');
        return false;
    }
    
    console.log('\n=== Testing Get Single Student ===');
    try {
        const response = await makeRequest({
            hostname: HOST,
            port: PORT,
            path: `/api/students/${createdStudentId}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Status Code:', response.statusCode);
        console.log('Student Data:', JSON.stringify(response.data, null, 2));
        return response.statusCode === 200;
    } catch (error) {
        console.error('Get Single Student Failed:', error.message);
        return false;
    }
}

// Test 5: Update Student
async function testUpdateStudent() {
    if (!createdStudentId) {
        console.log('Skipping Update Student - No student ID available');
        return false;
    }
    
    console.log('\n=== Testing Update Student ===');
    try {
        const updateData = {
            name: 'Updated Student Name',
            grade: 'A'
        };
        
        const response = await makeRequest({
            hostname: HOST,
            port: PORT,
            path: `/api/students/${createdStudentId}`,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        }, updateData);
        
        console.log('Status Code:', response.statusCode);
        console.log('Updated Student:', JSON.stringify(response.data, null, 2));
        return response.statusCode === 200;
    } catch (error) {
        console.error('Update Student Failed:', error.message);
        return false;
    }
}

// Test 6: Delete Student
async function testDeleteStudent() {
    if (!createdStudentId) {
        console.log('Skipping Delete Student - No student ID available');
        return false;
    }
    
    console.log('\n=== Testing Delete Student ===');
    try {
        const response = await makeRequest({
            hostname: HOST,
            port: PORT,
            path: `/api/students/${createdStudentId}`,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Status Code:', response.statusCode);
        console.log('Delete Response:', JSON.stringify(response.data, null, 2));
        return response.statusCode === 200;
    } catch (error) {
        console.error('Delete Student Failed:', error.message);
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log('Starting API Tests...');
    console.log('======================');
    
    const tests = [
        { name: 'Health Check', func: testHealthCheck },
        { name: 'Create Student', func: testCreateStudent },
        { name: 'Get All Students', func: testGetAllStudents },
        { name: 'Get Single Student', func: testGetSingleStudent },
        { name: 'Update Student', func: testUpdateStudent },
        { name: 'Delete Student', func: testDeleteStudent }
    ];
    
    let passed = 0;
    
    for (const test of tests) {
        console.log(`\nRunning Test: ${test.name}`);
        console.log(''.padEnd(50, '-'));
        
        const success = await test.func();
        if (success) {
            console.log(`✅ ${test.name} - PASSED`);
            passed++;
        } else {
            console.log(`❌ ${test.name} - FAILED`);
        }
    }
    
    console.log('\nTest Summary:');
    console.log('=============');
    console.log(`Total Tests: ${tests.length}`);
    console.log(`Passed: ${passed}`);
    console.log(`Failed: ${tests.length - passed}`);
    
    if (passed === tests.length) {
        console.log('\n🎉 All tests passed successfully!');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the logs above for details.');
    }
}

// Start the tests
runTests().catch(console.error);
