const Task = require("../models/task");
const User = require("../models/user");
const mongoose = require("mongoose");
const task_mainpage = async (req, res) => {
  const USER_ID = req.user.id;
  if (typeof req.query.finished != "undefined") {
    if (req.query.finished == "true") {
      finished_req = true;
    } else {
      finished_req = false;
    }
  } else {
    finished_req = false;
  }
  try {
    const user_data = await User.findById(USER_ID);
    const tasks = user_data.tasks.filter(function (obj) {
      return obj.finished == finished_req;
    });
    const groups = tasks.reduce((groups, item) => {
      const group = groups[item.date_deadline] || [];
      group.push(item);
      groups[item.date_deadline] = group;
      return groups;
    }, {});
    // const docs = await Task.aggregate([
    //   { $match: { finished: finished_req } },
    //   {
    //     $group: {
    //       // Each `_id` must be unique, so if there are multiple
    //       // documents with the same age, MongoDB will increment `count`.
    //       _id: "$date_deadline",
    //       count: { $sum: 1 },
    //       results: {
    //         $push: "$$ROOT",
    //       },
    //     },
    //   },
    // ]).sort({ _id: 1, "results.priority": 1 });
    // docs.forEach((res) => console.log(res));
    res.render("mainpage", {
      title: "Home",
      req: req,
      tasks: groups,
      finished: finished_req,
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
