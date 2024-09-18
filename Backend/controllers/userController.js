const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');

// Register a new user
async function registerUser(req, res) {
    let { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        let [existingUser] = await userModel.findUserByEmailOrUsername(email, username);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        let hashedPassword = await bcrypt.hash(password, 10);
        let userId = crypto.randomBytes(16).toString('hex');
        await userModel.registerUser(name, username, email, hashedPassword, userId);

        res.status(201).json({ message: 'User registered successfully', userId, name, username, email });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Get all users
async function getAllUsers(req, res) {
    try {
        let users = await userModel.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Log in a user
async function loginUser(req, res) {
    let { email, password } = req.body; // Remove username since we're only using email for login

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        let connection = await mysql.createConnection(dbConfig);

        // Check if the user exists by email
        let [user] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);

        if (user.length === 0) {
            await connection.end();
            return res.status(400).json({ error: 'User not found' });
        }

        let foundUser = user[0];

        // Compare the provided password with the hashed password in the database
        let isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            await connection.end();
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Mark the user as active
        await connection.execute('UPDATE users SET active = 1 WHERE userId = ?', [foundUser.userId]);
        await connection.end();

        res.status(200).json({
            message: 'Login successful',
            userId: foundUser.userId,
            name: foundUser.name,
            username: foundUser.username,
            createdAt: foundUser.created_at,
            active: foundUser.active,
            profilephoto_url: foundUser.profilephoto_url || null,
            email: foundUser.email,
            bio: foundUser.bio,
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


// Log out a user
async function logoutUser(req, res) {
    let userId = req.body.userId;
    try {
        await userModel.updateUserActiveStatus(userId, 0);
        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        console.error('Error logging out user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Delete a user
async function deleteUser(req, res) {
    let { userId } = req.params;
    try {
        await userModel.deleteUserById(userId);
        res.status(200).json('Account deleted successfully');
    } catch (err) {
        console.error('Error deleting account:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    registerUser,
    getAllUsers,
    loginUser,
    logoutUser,
    deleteUser,
};
