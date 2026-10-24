const express = require('express');
const { register, login, registerValidation, loginValidation } = require('../controllers/authController');
const validate = require('../middleware/validate');

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', registerValidation, validate, register);

// POST /api/auth/login - Login and receive JWT token
router.post('/login', loginValidation, validate, login);

module.exports = router;
