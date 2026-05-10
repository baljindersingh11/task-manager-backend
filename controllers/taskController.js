const Task = require('../models/tasks');

const createTask = async (req, res) => {

    try {

        const { title } = req.body || {};

        if (!title) {
            return res.status(400).json({
                message: 'Title is required'
            });
        }

        const newTask = new Task({
            title,
            user: req.user.id
        });

        await newTask.save();

        res.status(201).json(newTask);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const getTasks = async (req, res) => {

    try {

        const tasks = await Task.find({
            user: req.user.id
        });

        res.status(200).json(tasks);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const updateTask = async (req, res) => {

    try {

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        // Ownership check point
        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Unauthorized'
            });
        }

        task.title = req.body.title || task.title;
        task.completed = req.body.completed ?? task.completed;

        const updatedTask = await task.save();

        res.status(200).json(updatedTask);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

const deleteTask = async (req, res) => {

    try {

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: 'Task not found'
            });
        }

        // Ownership checkpoint
        if (task.user.toString() !== req.user.id) {
            return res.status(403).json({
                message: 'Unauthorized'
            });
        }

        await task.deleteOne();

        res.status(200).json({
            message: 'Task deleted successfully'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};
