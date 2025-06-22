const http = require('http');

const HOST = 'localhost';
const PORT = 3000;

function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: HOST,
            port: PORT,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = {
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: data ? JSON.parse(data) : null
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

async function runTests() {
    console.log('Starting API Tests...');
    console.log('======================\n');
    
    try {
        // Test 1: Health Check
        console.log('1. Testing Health Check...');
        const healthCheck = await makeRequest('/api/health');
        console.log('   Status Code:', healthCheck.statusCode);
        console.log('   Response:', JSON.stringify(healthCheck.data, null, 2));
        
        // Test 2: Create Student
        console.log('\n2. Testing Create Student...');
        const newStudent = {
            name: 'Test Student',
            email: `test.${Date.now()}@example.com`,
            age: 22,
            grade: 'A',
            courses: ['Math', 'Science']
        };
        
        const createStudent = await makeRequest('/api/students', 'POST', newStudent);
        console.log('   Status Code:', createStudent.statusCode);
        console.log('   Response:', JSON.stringify(createStudent.data, null, 2));
        
        const studentId = createStudent.data && createStudent.data.data ? createStudent.data.data._id : null;
        
        if (studentId) {
            // Test 3: Get All Students
            console.log('\n3. Testing Get All Students...');
            const allStudents = await makeRequest('/api/students');
            console.log('   Status Code:', allStudents.statusCode);
            console.log(`   Found ${allStudents.data.data ? allStudents.data.data.length : 0} students`);
            
            // Test 4: Get Single Student
            console.log(`\n4. Testing Get Student (ID: ${studentId})...`);
            const singleStudent = await makeRequest(`/api/students/${studentId}`);
            console.log('   Status Code:', singleStudent.statusCode);
            console.log('   Student Data:', JSON.stringify(singleStudent.data, null, 2));
            
            // Test 5: Update Student
            console.log(`\n5. Testing Update Student (ID: ${studentId})...`);
            const updateData = { name: 'Updated Student Name', grade: 'B' };
            const updatedStudent = await makeRequest(`/api/students/${studentId}`, 'PUT', updateData);
            console.log('   Status Code:', updatedStudent.statusCode);
            console.log('   Updated Data:', JSON.stringify(updatedStudent.data, null, 2));
            
            // Test 6: Delete Student
            console.log(`\n6. Testing Delete Student (ID: ${studentId})...`);
            const deleteStudent = await makeRequest(`/api/students/${studentId}`, 'DELETE');
            console.log('   Status Code:', deleteStudent.statusCode);
            console.log('   Delete Response:', JSON.stringify(deleteStudent.data, null, 2));
        } else {
            console.error('   Error: No student ID returned from create operation');
        }
    } catch (error) {
        console.error('Test Failed:', error.message);
    }
    
    console.log('\nTest completed!');
}

// Run the tests
runTests();
