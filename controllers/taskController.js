const Task = require("../models/task");
const login = require("../login");
const taskController = require("../controllers/taskController");
const task_mainpage = (req, res) => {
  Task.find()
    .then((result) => {
      let dates = [];
      result.forEach(function (result) {
        if (!dates.includes(result.date_deadline)) {
          dates.push(result.date_deadline);
        }
      });
      res.render("mainpage", {
        title: "Home",
        login: login,
        req: req,
        tasks: result,
        dates: dates.sort,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const task_details = (req, res, login) => {
  const id = req.params.id;
  Task.findById(id)
    .then((result) => {
      res.render("details", {
        title: "Task Details",
        task: result,
        login: login,
        req: req,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

task_create_post = (req, res) => {
  req.body.finished = false;
  const task = new Task(req.body);

  task
    .save()
    .then((result) => {
      res.redirect("/mainpage");
    })
    .catch((err) => console.log(err));
};

const task_delete = (req, res) => {
  const id = req.params.id;

  Task.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/mainpage" });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = { task_mainpage, task_delete, task_details, task_create_post };
