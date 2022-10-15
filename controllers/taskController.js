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
  // Task.findById(id)
  // .then((result) => {
  //   res.render("details", {
  //     title: "Task Details",
  //     task: result,
  //     req: req,
  //     edit: true,
  //   });
  // })
  // .catch((err) => {
  //   console.log(err);
  // });
  User.find({ _id: req.user.id }, { tasks: { $elemMatch: { _id: id } } })
    .then((result) => {
      res.render("details", {
        title: "Task Details",
        task: result,
        req: req,
        edit: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const task_update = async (req, res, next) => {
  const id = req.params.id;
  const update = req.body;
  const USER_ID = req.user.id;
  const options = { new: true };
  User.findByIdAndUpdate(
    { _id: USER_ID },
    { $set: { "tasks.$[e1].finished": update.finished } },
    {
      arrayFilters: [{ "e1._id": id }],
    }
  )
    .then((result) => {
      res.redirect("/mainpage");
    })
    .catch((err) => console.log(err));
  // const id = req.params.id;
  // const update = req.body;
  // const options = { new: true };
  // Task.findByIdAndUpdate(id, update, options)
  //   .then((result) => {
  //     res.redirect("/mainpage");
  //   })
  //   .catch((err) => console.log(err));
};

const task_create_post = (req, res) => {
  USER_ID = req.user.id;
  req.body.finished = false;

  User.findOneAndUpdate({ _id: USER_ID }, { $push: { tasks: req.body } }).then(
    (result) => {
      res.redirect("/mainpage");
    }
  );
  // const task = new Task(req.body);
  // console.log(req.body);
  //
  //
  // task
  //   .save()
  //   .then((result) => {
  //     res.redirect("/mainpage");
  //   })
  //   .catch((err) => console.log(err));
};
const task_edit = async (req, res, next) => {
  const id = req.params.id;
  const USER_ID = req.user.id;
  const options = { new: true };
  const checked = await User.find(
    { _id: req.user.id },
    { tasks: { $elemMatch: { _id: id } } }
  ).then((result) => {
    return result[0].tasks[0].finished;
  });
  req.body.finished = checked;
  const update = req.body;
  User.findByIdAndUpdate(
    { _id: USER_ID },
    { $set: { "tasks.$[e1]": update } },
    {
      arrayFilters: [{ "e1._id": id }],
    }
  )
    .then((result) => {
      res.redirect("/mainpage");
    })
    .catch((err) => console.log(err));
};
const task_to_edit = (req, res) => {
  const id = req.params.id;
  User.find({ _id: req.user.id }, { tasks: { $elemMatch: { _id: id } } })
    .then((result) => {
      res.render("create", {
        title: "Edit",
        task: result,
        req: req,
        edit: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
  // Task.findById(id)
  //   .then((result) => {
  //     res.render("create", {
  //       title: "Edit",
  //       task: result,
  //       req: req,
  //       edit: true,
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};
const task_delete = (req, res) => {
  const id = req.params.id;
  const USER_ID = req.user.id;
  User.findByIdAndUpdate(
    { _id: USER_ID },
    {
      $pull: {
        tasks: {
          _id: id,
        },
      },
    }
  ).then((result) => {
    res.json({ redirect: "/mainpage" });
  });

  // Task.findByIdAndDelete(id)
  // .then((result) => {
  //   res.json({ redirect: "/mainpage" });
  // })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

module.exports = {
  task_mainpage,
  task_delete,
  task_details,
  task_create_post,
  task_edit,
  task_update,
  task_to_edit,
};
