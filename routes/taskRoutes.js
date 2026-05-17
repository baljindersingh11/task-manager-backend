const express = require('express');

const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');

const {
    createTask,
    getTasks,
    getTaskStats,
    updateTask,
    deleteTask
} = require('../controllers/taskController');

// create task
router.post('/', authMiddleware, createTask);

// get task
router.get('/', authMiddleware, getTasks);

// get task stats
router.get('/stats', authMiddleware, getTaskStats);

// UPDATE TASK
router.put('/:id', authMiddleware, updateTask);


// DELETE TASK
router.delete('/:id', authMiddleware, deleteTask);


module.exports = router;
