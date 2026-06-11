const express = require('express');
const app = express();
const usersRouter = require('./routes/users');
const projectsRouter = require('./routes/projects');

// JSON parsing middleware
app.use(express.json());

// Mock Authentication Middleware
// Simulates an authenticated user. In a real app, this would verify a JWT or session.
app.use((req, res, next) => {
  // Hardcoded for testing. You can change this to simulate different roles/tenants.
  req.user = {
    id: 1,
    tenantId: 1, // Pouch.io
    role: 'admin' // admin | manager | employee
  };
  next();
});

// Main entry route
app.get('/', (req, res) => {
  res.json({
    name: 'CorpFlow SaaS API',
    version: '1.0.0-beta',
    status: 'online',
    message: 'Welcome to the CorpFlow internal workforce management API.',
    currentUser: req.user
  });
});

// Register routers
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);

// Basic 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 CorpFlow SaaS API Running on port ${PORT}`);
  console.log('------------------------------------------');
  console.log(`Root:     http://localhost:${PORT}/`);
  console.log(`Users:    http://localhost:${PORT}/users`);
  console.log(`Projects: http://localhost:${PORT}/projects\n`);
});
