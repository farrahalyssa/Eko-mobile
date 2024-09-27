const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mysql = require('mysql2/promise');
const dbConfig = require('../config/dbConfig');
const multer = require('multer');  // <-- Import multer
const { s3Client, PutObjectCommand, GetObjectCommand } = require('../config/awsConfig');

// Initialize multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });  // <-- Initialize multer

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

        let hashedPassword = await bcrypt.hash(password, 12);
        let userId = crypto.randomBytes(16).toString('hex');
        await userModel.registerUser(name, username, email, hashedPassword, userId);

        res.status(201).json({ message: 'User registered successfully', userId, name, username, email });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getOtherUserData(req, res) {
    const { userId } = req.params;

    try {
        const user = await userModel.getOtherUserData(userId);
        console.log(user);
        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Internal server error' });
}
}
async function getAllUsers(req, res) {
    try {
        let users = await userModel.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


async function loginUser(req, res) {
    let { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        let user = await userModel.findUserByEmail(email);
        if (user.length === 0) {
            return res.status(400).json({ error: 'User not found' });
        }

        let foundUser = user[0];

        let isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        await userModel.updateUserActiveStatus(foundUser.userId, 1);

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

async function updateUser(req, res) {
    const { userId } = req.params;
    const { name, username, bio } = req.body;
    console.log("name username bio", name, username, bio);
    const profilePhotoFile = req.file; 

    let profilephoto_url = null;

    try {
        if (profilePhotoFile) {
            const uploadParams = {
                Bucket: 'ekoapp-bucket', 
                Key: `${userId}/profile-photos/${profilePhotoFile.originalname}`,
                Body: profilePhotoFile.buffer,
                ContentType: profilePhotoFile.mimetype,
            };

            await s3Client.send(new PutObjectCommand(uploadParams));

            profilephoto_url = `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}`;
        }

        await userModel.updateUserProfile(userId, name, username, bio, profilephoto_url);

        res.status(200).json({ message: 'Profile updated successfully', profilephoto_url });
    } catch (err) {
        console.error('Error updating profile:', err.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getUserProfilePhoto(req, res) {
    const { userId } = req.params;

    try {
        const user = await userModel.findUserById(userId);
        if (!user || !user.profilephoto_url) {
            return res.status(404).json({ error: 'User or profile photo not found' });
        }

        const key = user.profilephoto_url.split('.com/')[1]; 

        const getObjectParams = {
            Bucket: 'ekoapp-bucket',  
            Key: key,  
        };

        const command = new GetObjectCommand(getObjectParams);
        const data = await s3Client.send(command);

        data.Body.pipe(res);

    } catch (err) {
        console.error('Error fetching profile photo:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    registerUser,
    getAllUsers,
    loginUser,
    logoutUser,
    deleteUser,
    updateUser,
    getUserProfilePhoto,
    getOtherUserData
};
