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
app.use(morgan("dev"));

// mongiise and mongo sandbox routes
app.get("/add-task", (req, res) => {
  const task = new Task({
    date_deadline: 05102022,
    task: "study",
    priority: 2,
    finished: false,
  });

  task
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => console.log(err));
});
app.get("/all-blogs", (req, res) => {
  Task.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get("/single-blog", (req, res) => {
  Task.findById("633d93f7b347f29b227a0c56")
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});
// routes
app.get("/", (req, res) => {
  res.render(page(login), { title: "Home", login: login });
});
app.get("/mainpage", (req, res) => {
  Task.find()
    .then((result) => {
      res.render("mainpage", { title: "Home", tasks: result });
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
  res.redirect("create", { title: "Submit a new task", login: login });
});
app.use((req, res) => {
  res.status(404).render("404", { title: "404", login: login });
});
