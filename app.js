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
const app = express();
const taskController = require("./controllers/taskController");
const dotenv = require("dotenv");
dotenv.config();
mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => console.log(err));
// mongoose
//   .connect(process.env.DATABASE)
//   .then((result) => app.listen(3000))
//   .catch((err) => console.log(err));
// register view engine
app.set("view engine", "ejs");
app.use(cookieParser());

// middleware & static files
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// routes
app.use((req, res, next) => {
  const token = req.cookies.token;
  try {
    if (typeof token != "undefined") {
      const data = jwt.verify(token, "verySecretValue");
      delete data.tasks;
      req.user = data;
    }
  } catch {
    (err) => res.clearCookie("token").then(res.redirect("/"));
  }

  next();
});
app.use(userRoutes);
app.get("/", (req, res) => {
  if (typeof req.user != "undefined") {
    res.redirect("/mainpage");
  } else {
    res.render("index", { title: "Home", req: req });
  }
});

app.get("/mainpage", isLoggedIn, taskController.task_mainpage);
app.get("/create_account", (req, res) => {
  res.render("create_account", {
    title: "Log in",
    req: req,
  });
});
app.get("/about", (req, res) => {
  res.render("about", { title: "About", req: req });
});
app.get("/mainpage/create", (req, res) => {
  res.render("create", {
    title: "Submit a new task",
    req: req,
    task: [],
  });
});

app.use("/mainpage", isLoggedIn, taskRoutes);

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (typeof req.user != "undefined") return next();

  // if they aren't redirect them to the home page
  res.redirect("/");
}
