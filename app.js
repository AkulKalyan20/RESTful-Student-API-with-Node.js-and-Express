const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

// Import routes
const studentRoutes = require('./routes/students');

// Initialize express app
const app = express();

// Enhanced logging
const logger = (req, res, next) => {
    const start = Date.now();
    
    // Log the request
    console.log(`\n[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    
    // Log request body if present
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    
    // Log query parameters if present
    if (req.query && Object.keys(req.query).length > 0) {
        console.log('Query:', JSON.stringify(req.query, null, 2));
    }
    
    // Log the response
    const originalSend = res.send;
    res.send = function(body) {
        const responseTime = Date.now() - start;
        console.log(`[${new Date().toISOString()}] Response Status: ${res.statusCode} (${responseTime}ms)`);
        if (body) {
            try {
                const jsonBody = typeof body === 'string' ? JSON.parse(body) : body;
                console.log('Response Body:', JSON.stringify(jsonBody, null, 2));
            } catch (e) {
                console.log('Response Body:', body);
            }
        }
        return originalSend.call(this, body);
    };
    
    next();
};

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(logger);

// Database connection with enhanced error handling
const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://127.0.0.1:27017/studentDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
        console.error('Please make sure MongoDB is running and accessible');
        process.exit(1);
    }
};

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(logger);

// Serve static files from the public directory
app.use(express.static('public'));

// API routes
app.use('/api/students', studentRoutes);

// Test route
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.url}`
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error Stack:', err.stack);
    res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

const server = app.listen(PORT, HOST, () => {
    console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode`);
    console.log(`Server URL: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
    console.log(`API Documentation: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/api-docs`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please free the port or specify a different port.`);
    } else {
        console.error('Failed to start server:', err);
    }
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});

module.exports = app;
