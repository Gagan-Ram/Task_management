const express = require("express")
const router = express.Router()

const  taskRoute  = require("./tasks.routes")

router.use("/tasks", taskRoute)

module.exports = router