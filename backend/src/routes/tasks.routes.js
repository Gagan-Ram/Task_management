const router = require("express").Router()
const {saveTask} = require("../validators/tasks.validators")
const validate=require("../middlewares/validate")
const  { taskController }  = require("../controllers/index.controller")

router.get("/", taskController.searchTask )

router.post("/",validate(saveTask), taskController.uploadTask )

router.get("/:id", taskController.getById )

router.patch("/", taskController.updateTask )
// accepts 
// {
//     _id
//     description
//     progress    .... status u have to update by considering the progress value ..[toDo, inprogress, almost-completed, completed]
// }

router.delete("/:taskId", taskController.deleteTask )  // accepts _id in params

module.exports = router