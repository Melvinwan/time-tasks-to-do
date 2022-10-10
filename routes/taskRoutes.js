const express = require("express");
const Task = require("../models/task");
const login = require("../login");
const taskController = require("../controllers/taskController");

const router = express.Router();
// mongoose and mongo sandbox routes
router.post("/create/:id", async (req, res, next) => {
  const id = req.params.id;
  const update = req.body;
  const options = { new: true };
  Task.findByIdAndUpdate(id, update, options)
    .then((result) => {
      res.redirect("/mainpage");
    })
    .catch((err) => console.log(err));
});
router.get("/:id", (req, res) => {
  const id = req.params.id;
  Task.findById(id)
    .then((result) => {
      res.render("details", {
        title: "Task Details",
        task: result,
        login: login,
        edit: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/create/:id", (req, res) => {
  const id = req.params.id;
  Task.findById(id)
    .then((result) => {
      res.render("create", {
        title: "Edit",
        task: result,
        login: login,
        edit: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/", (req, res) => {
  req.body.finished = false;
  const task = new Task(req.body);

  task
    .save()
    .then((result) => {
      res.redirect("/mainpage");
    })
    .catch((err) => console.log(err));
});
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  Task.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/mainpage" });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
