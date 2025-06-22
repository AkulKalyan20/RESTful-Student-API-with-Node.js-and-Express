const http = require('http');

// Test the health check endpoint
const options = {
  hostname: 'localhost',
  port: 3000,
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
    console.log('Response Body:', data);
    
    // If health check passes, test creating a student
    if (res.statusCode === 200) {
      testCreateStudent();
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.end();

function testCreateStudent() {
  const postData = JSON.stringify({
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: 20,
    grade: 'A',
    courses: ['Math', 'Science']
  });

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/students',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  };

  const req = http.request(options, (res) => {
    console.log(`\nCreate Student - Status Code: ${res.statusCode}`);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Create Student - Response:', data);
      
      // If student was created, try to retrieve all students
      if (res.statusCode === 201) {
        testGetAllStudents();
      }
    });
  });

  req.on('error', (error) => {
    console.error('Error creating student:', error);
  });

  req.write(postData);
  req.end();
}

function testGetAllStudents() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/students',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    console.log(`\nGet All Students - Status Code: ${res.statusCode}`);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('Get All Students - Response:', data);
    });
  });

  req.on('error', (error) => {
    console.error('Error getting students:', error);
  });

  req.end();
}
