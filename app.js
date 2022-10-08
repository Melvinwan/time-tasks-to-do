const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Task = require("./models/task");
const { result } = require("lodash");

const app = express();

const dbURI =
  "mongodb+srv://melvinwan:Zim12345!@time-task-to-do.axails6.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(dbURI)
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// register view engine
app.set("view engine", "ejs");

// check login
const login = false;
const page = function (login) {
  if (login) {
    return "mainpage";
  } else {
    return "index";
  }
};

// middleware & static files
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// routes
app.get("/", (req, res) => {
  res.render(page(login), { title: "Home", login: login });
});
app.get("/mainpage", (req, res) => {
  Task.find()
    .then((result) => {
      let dates = [];
      result.forEach(function (result) {
        if (!dates.includes(result.date_deadline)) {
          dates.push(result.date_deadline);
        }
      });
      console.log(dates.sort());
      res.render("mainpage", {
        title: "Home",
        login: login,
        tasks: result,
        dates: dates.sort,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get("/create_account", (req, res) => {
  res.render("create_account", { title: "Log in", login: login });
});
app.get("/about", (req, res) => {
  res.render("about", { title: "About", login: login });
});
app.get("/mainpage/create", (req, res) => {
  res.render("create", { title: "Submit a new task", login: login });
});
// mongoose and mongo sandbox routes
app.post("/mainpage", (req, res) => {
  req.body.finished = false;
  const task = new Task(req.body);

  task
    .save()
    .then((result) => {
      res.redirect("/mainpage");
    })
    .catch((err) => console.log(err));
});
app.get("/mainpage/:id", (req, res) => {
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
app.delete("/mainpage/:id", (req, res) => {
  const id = req.params.id;

  Task.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/mainpage" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "404", login: login });
});
