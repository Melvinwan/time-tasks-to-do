const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const Task = require("./models/task");
const User = require("./models/user");
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
app.use(cookieParser());

// middleware & static files
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// routes
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (typeof token != "undefined") {
    const data = jwt.verify(token, "verySecretValue");
    req.user = data;
  }
  next();
});
app.use(userRoutes);
app.get("/", (req, res) => {
  if (typeof req.user != "undefined") {
    console.log("YES");
    res.redirect("/mainpage");
  } else {
    console.log("NO");
    res.render("index", { title: "Home", login: login, req: req });
  }
});

app.get("/mainpage", isLoggedIn, taskController.task_mainpage);
app.get("/create_account", (req, res) => {
  res.render("create_account", {
    title: "Log in",
    login: login,
    req: req,
  });
});
app.get("/about", (req, res) => {
  res.render("about", { title: "About", login: login, req: req });
});
app.get("/mainpage/create", (req, res) => {
  res.render("create", {
    title: "Submit a new task",
    login: login,
    req: req,
    task: {},
  });
});

app.use("/mainpage", isLoggedIn, taskRoutes);

app.use((req, res) => {
  res.status(404).render("404", { title: "404", login: login });
});
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (typeof req.user != "undefined") return next();

  // if they aren't redirect them to the home page
  res.redirect("/");
}
