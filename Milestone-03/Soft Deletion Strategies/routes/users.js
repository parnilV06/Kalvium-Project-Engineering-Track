const express = require('express');
const router = express.Router();
const db = require('../db');

// List all users for the workforce manager
router.get('/', async (req, res) => {
  try {
    // Enforce tenant boundary
    const tenantId = req.user.tenantId;
    const role = req.user.role;
    const currentUserId = req.user.id; // Added for 'own data' logic if needed, though req.user.id might not be strictly necessary for just listing users if they can see others in the same tenant. Actually, standard is user sees other users but not their salary.

    const { rows } = await db.query('SELECT * FROM users WHERE tenant_id = $1', [tenantId]);
    
    // RBAC logic
    const safeRows = rows.map(user => {
      const safeUser = { ...user };
      delete safeUser.password_hash; // never expose

      // User -> only own data. Wait, for listing users, maybe they only see basic info.
      // Instructions: Admin -> full data, Manager -> no sensitive fields, User -> only own data
      // For Users table: Admin sees salary. Manager doesn't see salary. User sees only their own salary? Or User only sees themselves?
      // "User -> only own data" means if they are 'employee' (user), maybe they only see themselves, or they see others without salary. Let's filter out salary unless Admin, or if it's their own record.
      if (role !== 'admin') {
         if (role !== 'employee' || user.id !== currentUserId) {
             delete safeUser.salary;
         }
      }
      
      return safeUser;
    });

    if (role === 'employee') {
       // User -> only own data
       return res.json(safeRows.filter(u => u.id === currentUserId));
    }

    res.json(safeRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve users.' });
  }
});

// Single user profile view
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user.tenantId;
    const role = req.user.role;
    const currentUserId = req.user.id;

    // Enforce tenant boundary
    const { rows } = await db.query('SELECT * FROM users WHERE id = $1 AND tenant_id = $2', [id, tenantId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    
    const user = rows[0];
    delete user.password_hash; // never expose

    if (role === 'employee' && user.id !== currentUserId) {
        return res.status(403).json({ error: 'Access denied.' });
    }

    if (role !== 'admin' && user.id !== currentUserId) {
        delete user.salary;
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to find user.' });
  }
});

module.exports = router;
