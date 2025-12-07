const express = require('express');
const router = express.Router();
const { registerUser, loginUser, deleteUser } = require('../controllers/authController');
const auth = require('../middleware/auth');

// @route   POST /api/auth/signup
router.post('/signup', registerUser);

// @route   POST /api/auth/login
router.post('/login', loginUser);

// @route   DELETE /api/auth/user
router.delete('/user', auth, deleteUser);

module.exports = router;