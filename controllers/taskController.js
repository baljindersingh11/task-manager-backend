const Task = require('../models/Task');

const createTask = async (req, res, next) => {

    try {

        const { title, dueDate } = req.body || {};

        if (!title) {
            return res.status(400).json({
                message: 'Title is required'
            });
        }

        const newTask = new Task({
            title,
            dueDate: dueDate || undefined,
            user: req.user.id
        });

        await newTask.save();

        res.status(201).json(newTask);

    } catch (error) {

        next(error);

    }

};

const getTasks = async (req, res, next) => {

    try {

        const { sortBy } = req.query;

        const tasks = await Task.find({
            user: req.user.id
        }).sortTasks(sortBy);

        res.status(200).json(tasks);

    } catch (error) {

        next(error);

    }

};

const getTaskStats = async (req, res, next) => {

    try {

        const [stats] = await Task.getUserTaskStats(req.user.id);

        res.status(200).json(stats || {
            total: 0,
            completed: 0,
            pending: 0
        });

    } catch (error) {

        next(error);

    }

};

const updateTask = async (req, res, next) => {

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

        if (Object.prototype.hasOwnProperty.call(req.body, 'dueDate')) {
            task.dueDate = req.body.dueDate || null;
        }

        const updatedTask = await task.save();

        res.status(200).json(updatedTask);

    } catch (error) {

        next(error);

    }

};

const deleteTask = async (req, res, next) => {

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

        next(error);

    }

};

module.exports = {
    createTask,
    getTasks,
    getTaskStats,
    updateTask,
    deleteTask
};
