const express = require("express");

const router = express.Router();
// mongoose and mongo sandbox routes
router.post("/mainpage", (req, res) => {
  req.body.finished = false;
  const task = new Task(req.body);

  task
    .save()
    .then((result) => {
      res.redirect("/mainpage");
    })
    .catch((err) => console.log(err));
});
router.get("/mainpage/:id", (req, res) => {
  const id = req.params.id;
  Task.findById(id)
    .then((result) => {
      res.render("details", {
        title: "Task Details",
        task: result,
        login: login,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.delete("/mainpage/:id", (req, res) => {
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
