const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');
const homeworkRoutes = require('./routes/homework.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Swagger
app.use('/swagger/index', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Create uploads directories
['uploads/profiles','uploads/coverPicture', 'uploads/homework'].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/homework', homeworkRoutes);

// MongoDB connection with better error handling
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB Atlas successfully!');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Connect to MongoDB
console.log('Connecting to MongoDB Atlas...');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    // Start server only after successful connection
    const PORT = process.env.PORT || 3000;

    console.log(`port`, PORT);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Server error',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});