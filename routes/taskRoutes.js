const express = require("express");
const Task = require("../models/task");
const taskController = require("../controllers/taskController");
const User = require("../models/user");

const router = express.Router();
// mongoose and mongo sandbox routes
router.post("/create/:id", taskController.task_edit);
router.post("/update/:id", taskController.task_update);
router.get("/:id", taskController.task_details);
router.get("/create/:id", taskController.task_to_edit);
router.post("/", taskController.task_create_post);
router.delete("/:id", taskController.task_delete);

module.exports = router;
