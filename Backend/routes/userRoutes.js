const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register a user
router.post('/api/register', userController.registerUser);

// Get all users
router.get('/api/users', userController.getAllUsers);

// Login user
router.post('/api/login', userController.loginUser);

// Logout user
router.put('/api/logout', userController.logoutUser);

// Delete user account
router.delete('/api/users/:userId/delete-account', userController.deleteUser);



module.exports = router;
