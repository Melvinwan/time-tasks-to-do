const Task = require("../models/task");
const taskController = require("../controllers/taskController");
const task_mainpage = async (req, res) => {
  try {
    const docs = await Task.aggregate([
      { $match: { finished: false } },
      {
        $group: {
          // Each `_id` must be unique, so if there are multiple
          // documents with the same age, MongoDB will increment `count`.
          _id: "$date_deadline",
          count: { $sum: 1 },
          results: {
            $push: "$$ROOT",
          },
        },
      },
    ]);
    res.render("mainpage", {
      title: "Home",
      req: req,
      tasks: docs,
    });
  } catch (err) {
    console.log(err);
  }
};

const task_details = (req, res) => {
  const id = req.params.id;
  Task.findById(id)
    .then((result) => {
      res.render("details", {
        title: "Task Details",
        task: result,
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
