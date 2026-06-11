const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
const cacheService = require('./services/cache.service');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// GET /tasks
app.get('/tasks', async (req, res, next) => {
  try {
    const cacheKey = 'tasks:list';
    
    const cachedTasks = cacheService.get(cacheKey);
    if (cachedTasks) {
      console.log('Serving from cache');
      return res.status(200).json(cachedTasks);
    }

    const tasks = await prisma.task.findMany();
    
    // Cache the resolved data, not a promise
    cacheService.set(cacheKey, tasks);
    
    res.status(200).json(tasks);
  } catch (err) {
    next(err); // Pass error to Express error handler
  }
});

// GET /tasks/:id
app.get('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id, 10);
    
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }

    const cacheKey = `task:${taskId}`;

    const cachedTask = cacheService.get(cacheKey);
    if (cachedTask) {
      return res.status(200).json(cachedTask);
    }

    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Cache service avoids caching null values natively now
    cacheService.set(cacheKey, task);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// POST /tasks
app.post('/tasks', async (req, res, next) => {
  try {
    const { title, description, price } = req.body;
    
    const newTask = await prisma.task.create({
      data: { title, description, price: parseFloat(price) }
    });

    // Invalidate the tasks list cache as a new item was added
    cacheService.delete('tasks:list');
    
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
});

// PUT /tasks/:id
app.put('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id, 10);
    
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }

    const { title, description, price } = req.body;

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: { title, description, price: parseFloat(price) }
    });

    // Invalidate both the item and the list cache
    cacheService.delete(`task:${taskId}`);
    cacheService.delete('tasks:list');

    res.status(200).json(updatedTask);
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id
app.delete('/tasks/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const taskId = parseInt(id, 10);
    
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({
      where: { id: taskId }
    });

    // Invalidate both the item and the list cache
    cacheService.delete(`task:${taskId}`);
    cacheService.delete('tasks:list');
    
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
