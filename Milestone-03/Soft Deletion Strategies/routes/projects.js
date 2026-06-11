const express = require('express');
const router = express.Router();
const db = require('../db');

// List projects across the entire system
// Fixed: Added tenant isolation and project access control
router.get('/', async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const role = req.user.role;

    const { rows } = await db.query('SELECT * FROM projects WHERE tenant_id = $1', [tenantId]);
    
    const safeRows = rows.map(project => {
      const safeProject = { ...project };
      if (role === 'employee') {
        delete safeProject.budget;
      }
      return safeProject;
    });

    res.json(safeRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to find projects.' });
  }
});

// Specific project details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user.tenantId;
    const role = req.user.role;

    const { rows } = await db.query('SELECT * FROM projects WHERE id = $1 AND tenant_id = $2', [id, tenantId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    
    const project = rows[0];
    if (role === 'employee') {
      delete project.budget;
    }

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve project info.' });
  }
});

module.exports = router;
