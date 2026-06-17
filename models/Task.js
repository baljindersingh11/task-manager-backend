const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },

    completed: {
        type: Boolean,
        default: false
    },

    dueDate: {
        type: Date,
        required: false
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, {
    timestamps: true
});

taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ user: 1, completed: 1 });

taskSchema.query.sortTasks = function (sortBy = 'createdAt') {
    const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'completed'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = sortField === 'title' ? 1 : -1;

    return this.sort({ [sortField]: sortOrder });
};

taskSchema.statics.getUserTaskStats = function (userId) {
    return this.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $group: {
                _id: '$completed',
                count: { $sum: 1 }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$count' },
                completed: {
                    $sum: {
                        $cond: [{ $eq: ['$_id', true] }, '$count', 0]
                    }
                },
                pending: {
                    $sum: {
                        $cond: [{ $eq: ['$_id', false] }, '$count', 0]
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                total: 1,
                completed: 1,
                pending: 1
            }
        }
    ]);
};

module.exports = mongoose.model('Task', taskSchema);
