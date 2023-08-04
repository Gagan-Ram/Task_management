const Joi = require('joi');

const { tasksService } = require("../services/tasks.service")



const uploadTask = async (req, res) => {
    // console.log('1')
    const task = req.body
    // console.log(task)

    try {
        const taskInserted = await tasksService.insert(task)
        res.json(taskInserted)

    } catch (error) {
        res.status(500).json({
            message: "Couldn't upload tasks",
            error
        })
    }

}

const searchTask = async (req, res) => {
    // const query = req.query
    // console.log('1')

    try {
        const result = await tasksService.searchByFilters()
        res.json({
            "tasks": result
        })

    } catch (error) {
        res.status(500).json({
            message: "Couldn't find tasks",
            error,
        })
    }
}

const updateTask = async (req, res) => {

    const body = req.body
    
    // console.log(body);

    try {
        const result = await tasksService.updateTheTask(body)
        res.json(result)

    } catch (error) {
        res.status(500).json({
            message: "Couldn't find tasks",
            error,
        })

    }
}

const getById = async (req, res) => {
    const id = req.params.id
    try {

        const result = await tasksService.searchForTask(id)
        res.json(result)

    } catch (error) {
        res.status(500).json({
            message: "Couldn't find tasks",
            error,
        })

    }
}

const deleteTask = async (req, res) => {
    // const id = req.params.id
    const _id = req.params.taskId
    console.log(_id)
    try {

        const result = await tasksService.deleteTheTask(_id)
        res.json(result)

    } catch (error) {
        res.status(500).json({
            message: "Couldn't delete tasks",
            error,
        })

    }
}


module.exports = {
    uploadTask,
    searchTask,
    updateTask,
    getById,
    deleteTask
}