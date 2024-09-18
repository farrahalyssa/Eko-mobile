const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// Define the search endpoint
router.get('/api/search', searchController.searchUsers);

module.exports = router;
