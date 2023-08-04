const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({

    title: {
        type: String,
        unique: true,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    progress: {
        type: Number,
        default: 0
    },

    status: {
        type: String,
        default: "toDo"
    },

    dueDate: {
        type: Date,
        required: true,
        format: "DD MMM YYYY"
    }
},
    { timestamps: true }
)

const tasksModel = mongoose.model("tasks", taskSchema)

module.exports = tasksModel