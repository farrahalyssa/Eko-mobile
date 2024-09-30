const notificationModel = require('../models/notificationModel');

async function getNotifications(req, res) {
    const { userId } = req.params;
    console.log('Received userId hehe:', userId);
    try {
        const notifications = await notificationModel.getNotifications(userId);
        res.status(200).json(notifications);
    } catch (err) {
        console.error('Error fetching notifications:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getNotifications
};
