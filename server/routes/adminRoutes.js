const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {authenticateToken,checkRole} = require('../middleware/auth'); // Your JWT middleware

// Admin login route (no authentication required)
router.post('/login', adminController.adminLogin);

// Protected routes (require admin authentication)
router.get('/role-upgrade-requests', authenticateToken, checkRole(['admin']), adminController.getAllRoleUpgradeRequests);

// Get requests by status
router.get('/role-upgrade-requests/status/:status', authenticateToken, checkRole(['admin']), adminController.getRoleUpgradeRequestsByStatus);

// Get requests by role
router.get('/role-upgrade-requests/role/:role', authenticateToken, checkRole(['admin']), adminController.getRoleUpgradeRequestsByRole);

// Get requests by combined status and role
router.get('/role-upgrade-requests/status/:status/role/:role', authenticateToken, checkRole(['admin']), adminController.getRoleUpgradeRequestsByStatusAndRole);

// Update request status
router.put('/role-upgrade-requests/:requestId', authenticateToken, checkRole(['admin']), adminController.updateRoleUpgradeRequestStatus);

module.exports = router;
