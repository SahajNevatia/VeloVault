const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');

/**
 * Express application setup.
 * Configures middleware, routes, and error handling.
 * Exported separately from server for testing purposes.
 */
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'VeloVault API is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Static frontend serving for full-stack deployment (Render, Heroku, etc.)
const frontendDist = path.join(__dirname, '../../frontend/dist');

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  // Fallback endpoint for backend-only deployment
  app.get('/', (req, res) => {
    res.status(200).json({
      success: true,
      message: '🚗 VeloVault Backend API is running on Render',
      documentation: 'https://github.com/SahajNevatia/VeloVault',
      endpoints: {
        health: '/api/health',
        auth: {
          register: 'POST /api/auth/register',
          login: 'POST /api/auth/login',
        },
        vehicles: {
          all: 'GET /api/vehicles',
          search: 'GET /api/vehicles/search',
          details: 'GET /api/vehicles/:id',
          purchase: 'POST /api/vehicles/:id/purchase',
          restock: 'POST /api/vehicles/:id/restock',
        },
      },
    });
  });
}

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
