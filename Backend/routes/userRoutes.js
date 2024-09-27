const express = require('express');
const router = express.Router();
const multer = require('multer');
const { updateUser } = require('../controllers/userController');
const userController = require('../controllers/userController');
const upload = multer({ storage: multer.memoryStorage() }); // Initialize multer

router.post('/api/register', userController.registerUser);

router.get('/api/users', userController.getAllUsers);

router.post('/api/login', userController.loginUser);

router.put('/api/logout', userController.logoutUser);

router.delete('/api/users/:userId/delete-account', userController.deleteUser);

router.put('/api/users/:userId', upload.single('profilePhoto'), updateUser);

router.get('/api/users/:userId', userController.getOtherUserData);
module.exports = router;
