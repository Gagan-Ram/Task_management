const { tasks } = require("../model/index.model")

// function contentFunction(contentRating) {
//     const ratings = ["Any age group", "7+", "12+", "16+", "18+"]

//     const index = ratings.indexOf(contentRating)
//     const contentFilter = ratings.splice(index)

//     ratingObjectArray = []
//     contentFilter.forEach((value, index) => {
//         ratingObjectArray.push(value)
//     })

//     return { $in: ratingObjectArray }
// }

const insert = async (video) => {
    try {
        const insertTasks = new tasks(video)

        const insertDocument = await insertTasks.save(insertTasks)

        return insertDocument


    } catch (error) {
        throw new Error("Couldn't  upload tasks into database");
    }
}

const searchByFilters = async () => {

    const filters = {}

    try {

        const task = await tasks.find(filters)
        console.log(task)
        return task

    } catch (error) {
        throw new Error("Couldn't find tasks in the database");
    }
}

const deleteTheTask = async (_id) => {

    const filters = { _id: _id }

    try {

        const task = await tasks.deleteOne(filters)
        return task

    } catch (error) {
        throw new Error("Couldn't delete tasks in the database");
    }
}




const updateTheTask = async (body) => {

    // console.log(body);
    const { _id, description, progress } = body
    console.log("progress is ----------------------------------------------------------------------> "+ progress)

    let updateObject

    try {
        const filter = { _id: _id }
        let updatedDocument

        if (description) {

            updatedDocument = await tasks.findOneAndUpdate(filter, { description: description }, { new: true })
        }
        else if (progress) {
            updateObject = {
                progress: progress
            }
            if( progress > 0 && progress < 75 ){
                updateObject.status = "inprogress"
            }
            else if( progress > 75 && progress < 100 ){
                updateObject.status = "almost-completed"
            }
            else if( progress >= 100 ){
                updateObject.status = "completed"
            }

            updatedDocument = await tasks.findByIdAndUpdate(filter, updateObject , { new: true })
        }
        return updatedDocument

    } catch (error) {
        throw new Error("Couldn't update tasks in database")
    }

}

const searchForTask = async (id) => {

    try {
        const filter = { _id: _id }

        const findvideo = await tasks.findById(filter)
        return findvideo

    } catch (error) {
        throw new Error("Couldn't search tasks from database")
    }

}

module.exports = {

    tasksService: {
        insert,
        searchByFilters,
        updateTheTask,
        searchForTask,
        deleteTheTask
    }

}