const adminModel = require('../models/adminModel');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/constants');

// Get all role upgrade requests
const getAllRoleUpgradeRequests = async (req, res) => {
    try {
        const requests = await adminModel.getAllRoleUpgradeRequests();
        res.json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Error getting role upgrade requests:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching role upgrade requests'
        });
    }
};

// Get role upgrade requests by status
const getRoleUpgradeRequestsByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const requests = await adminModel.getRoleUpgradeRequestsByStatus(status);
        res.json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Error getting role upgrade requests by status:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching role upgrade requests by status'
        });
    }
};

// Get role upgrade requests by role
const getRoleUpgradeRequestsByRole = async (req, res) => {
    try {
        const { role } = req.params;
        const requests = await adminModel.getRoleUpgradeRequestsByRole(role);
        res.json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Error getting role upgrade requests by role:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching role upgrade requests by role'
        });
    }
};

// Get role upgrade requests by status and role
const getRoleUpgradeRequestsByStatusAndRole = async (req, res) => {
    try {
        const { status, role } = req.params;
        const requests = await adminModel.getRoleUpgradeRequestsByStatusAndRole(status, role);
        res.json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Error getting role upgrade requests by status and role:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching role upgrade requests by status and role'
        });
    }
};

// Update role upgrade request status
const updateRoleUpgradeRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        // Validate status
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be pending, approved, or rejected'
            });
        }

        const success = await adminModel.updateRoleUpgradeRequestStatus(requestId, status);
        
        if (success) {
            res.json({
                success: true,
                message: `Request ${status} successfully`
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }
    } catch (error) {
        console.error('Error updating role upgrade request:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating role upgrade request'
        });
    }
};

// Admin login
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const result = await adminModel.adminLogin(email, password);

        if (!result.success) {
            return res.status(401).json({
                success: false,
                message: result.message
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: result.user.user_id, 
                email: result.user.email, 
                role: 'admin' 
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: result.user
        });
    } catch (error) {
        console.error('Error in admin login:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login process'
        });
    }
};

module.exports = {
    getAllRoleUpgradeRequests,
    getRoleUpgradeRequestsByStatus,
    getRoleUpgradeRequestsByRole,
    updateRoleUpgradeRequestStatus,
    adminLogin,
    getRoleUpgradeRequestsByStatusAndRole
};
