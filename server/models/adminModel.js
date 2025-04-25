const db = require('../config/dbconfig');
const bcrypt = require('bcrypt');



// Get all role upgrade requests
const getAllRoleUpgradeRequests = async () => {
    try {
        const [requests] = await db.query(`
            SELECT r.*, u.name, u.email 
            FROM Role_Upgrade_Requests r
            JOIN Users u ON r.user_id = u.user_id
            ORDER BY r.requested_at DESC
        `);
        return requests;
    } catch (error) {
        throw error;
    }
};

// Get role upgrade requests by status
const getRoleUpgradeRequestsByStatus = async (status) => {
    try {
        const [requests] = await db.query(`
            SELECT r.*, u.name, u.email 
            FROM Role_Upgrade_Requests r
            JOIN Users u ON r.user_id = u.user_id
            WHERE r.status = ?
            ORDER BY r.requested_at DESC
        `, [status]);
        return requests;
    } catch (error) {
        throw error;
    }
};

// Update role upgrade request status
const updateRoleUpgradeRequestStatus = async (requestId, status) => {
    try {
        // Start a transaction
        await db.query('START TRANSACTION');

        // First, get the request details including user_id and requested_role
        const [requests] = await db.query(`
            SELECT user_id, requested_role 
            FROM Role_Upgrade_Requests 
            WHERE request_id = ?
        `, [requestId]);

        if (requests.length === 0) {
            await db.query('ROLLBACK');
            return false;
        }

        const { user_id, requested_role } = requests[0];

        // Update the request status
        const [result] = await db.query(`
            UPDATE Role_Upgrade_Requests 
            SET status = ?, reviewed_at = CURRENT_TIMESTAMP
            WHERE request_id = ?
        `, [status, requestId]);

        // If status is approved, update the user's role
        if (status === 'approved' && result.affectedRows > 0) {
            // Get current user roles
            const [users] = await db.query(`
                SELECT role 
                FROM Users 
                WHERE user_id = ?
            `, [user_id]);

            if (users.length > 0) {
                let currentRoles;
                try {
                    // Handle both JSON string and comma-separated string cases
                    if (typeof users[0].role === 'string') {
                        try {
                            currentRoles = JSON.parse(users[0].role);
                        } catch (e) {
                            // If JSON parsing fails, try splitting by comma
                            currentRoles = users[0].role.split(',').map(role => role.trim());
                        }
                    } else {
                        currentRoles = users[0].role;
                    }
                } catch (error) {
                    console.error('Error processing roles:', error);
                    await db.query('ROLLBACK');
                    return false;
                }
                
                // Ensure currentRoles is an array
                if (!Array.isArray(currentRoles)) {
                    currentRoles = [currentRoles];
                }
                
                // Add the new role if it doesn't exist
                if (!currentRoles.includes(requested_role)) {
                    currentRoles.push(requested_role);
                    
                    // Update the user's role
                    await db.query(`
                        UPDATE Users 
                        SET role = ? 
                        WHERE user_id = ?
                    `, [JSON.stringify(currentRoles), user_id]);
                }
            }
        }

        await db.query('COMMIT');
        return result.affectedRows > 0;
    } catch (error) {
        await db.query('ROLLBACK');
        throw error;
    }
};

// Get role upgrade requests by requested role
const getRoleUpgradeRequestsByRole = async (requestedRole) => {
    try {
        const [requests] = await db.query(`
            SELECT r.*, u.name, u.email 
            FROM Role_Upgrade_Requests r
            JOIN Users u ON r.user_id = u.user_id
            WHERE r.requested_role = ?
            ORDER BY r.requested_at DESC
        `, [requestedRole]);
        return requests;
    } catch (error) {
        throw error;
    }
};

// Admin login
const adminLogin = async (email, password) => {
    try {
        // Check if user exists and has admin role
        const [users] = await db.query(`
            SELECT user_id, email, password_hash, role 
            FROM Users 
            WHERE email = ?
        `, [email]);

        if (users.length === 0) {
            return { success: false, message: 'User not found' };
        }

        const user = users[0];
        
        // Parse the role JSON and check if user has admin role
        let userRoles;
        try {
            userRoles = typeof user.role === 'string' ? JSON.parse(user.role) : user.role;
        } catch (error) {
            console.error('Error parsing role:', error);
            return { success: false, message: 'Error processing user role' };
        }

        if (!Array.isArray(userRoles) || !userRoles.includes('admin')) {
            return { success: false, message: 'User is not an admin' };
        }

        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return { success: false, message: 'Invalid password' };
        }

        // Update user object with parsed role
        user.role = userRoles;

        // Remove password_hash from user object before returning
        delete user.password_hash;
        return { success: true, user };
    } catch (error) {
        throw error;
    }
};

// Get role upgrade requests by status and role
const getRoleUpgradeRequestsByStatusAndRole = async (status, role) => {
    try {
        const [requests] = await db.query(`
            SELECT r.*, u.name, u.email 
            FROM Role_Upgrade_Requests r
            JOIN Users u ON r.user_id = u.user_id
            WHERE r.status = ? AND r.requested_role = ?
            ORDER BY r.requested_at DESC
        `, [status, role]);
        return requests;
    } catch (error) {
        throw error;
    }
};

    // // Get role upgrade request by ID
    // const getRoleUpgradeRequestById = async (requestId) => {
    //     try {
    //         const [requests] = await db.query(`
    //             SELECT r.*, u.username, u.email 
    //             FROM Role_Upgrade_Requests r
    //             JOIN Users u ON r.user_id = u.user_id
    //             WHERE r.request_id = ?
    //         `, [requestId]);
    //         return requests[0];
    //     } catch (error) {
    //         throw error;
    //     }
    // };

module.exports = {
    getAllRoleUpgradeRequests,
    getRoleUpgradeRequestsByStatus,
    updateRoleUpgradeRequestStatus,
    getRoleUpgradeRequestsByRole,
    adminLogin,
    getRoleUpgradeRequestsByStatusAndRole
};
