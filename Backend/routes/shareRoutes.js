const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');

router.post('/api/shares', shareController.createShare);
router.get('/api/shares/:userId', shareController.getShares);
router.delete('/api/shares/:shareId', shareController.unsharePost);

module.exports = router;
