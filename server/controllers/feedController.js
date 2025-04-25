const feedModel = require('../models/feedModel');

/**
 * Get feed items with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getFeed = async (req, res) => {
    try {
        // Get page and limit from query parameters, with defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;

        // Validate page and limit
        if (page < 1 || limit < 1) {
            return res.status(400).json({
                success: false,
                message: 'Invalid page or limit parameters'
            });
        }

        // Get feed items from model
        const feedData = await feedModel.getFeedItems(page, limit);

        return res.status(200).json({
            success: true,
            data: feedData
        });

    } catch (error) {
        console.error('Error in getFeed controller:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message
        });
    }
};

module.exports = {
    getFeed
};
