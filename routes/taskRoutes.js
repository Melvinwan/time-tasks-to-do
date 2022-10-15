const express = require("express");
const Task = require("../models/task");
const taskController = require("../controllers/taskController");
const User = require("../models/user");

const router = express.Router();
// mongoose and mongo sandbox routes
router.post("/create/:id", async (req, res, next) => {
  const id = req.params.id;
  const update = req.body;
  const USER_ID = req.user.id;
  const options = { new: true };
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
});
router.post("/update/:id", async (req, res, next) => {
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
});
router.get("/:id", (req, res) => {
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
});
router.get("/create/:id", (req, res) => {
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
});
router.post("/", (req, res) => {
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
});
router.delete("/:id", (req, res) => {
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
});

module.exports = router;
