const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const Task = require("./models/task");
const { result } = require("lodash");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const login = require("./login");
const app = express();
const taskController = require("./controllers/taskController");
const dbURL = require("./dbURL");
mongoose
  .connect(dbURL)
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));
// register view engine
app.set("view engine", "ejs");

// middleware & static files
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// routes

app.get("/", (req, res) => {
  if (login) {
    res.redirect("/mainpage");
  } else {
    res.render("index", { title: "Home", login: login });
  }
});

app.get("/mainpage", taskController.task_mainpage);
app.get("/create_account", (req, res) => {
  res.render("create_account", {
    title: "Log in",
    login: login,
  });
});
app.get("/about", (req, res) => {
  res.render("about", { title: "About", login: login });
});
app.get("/mainpage/create", (req, res) => {
  res.render("create", {
    title: "Submit a new task",
    login: login,
    task: {},
  });
});

app.use("/mainpage", taskRoutes);
app.use(userRoutes);

app.use((req, res) => {
  res.status(404).render("404", { title: "404", login: login });
});
