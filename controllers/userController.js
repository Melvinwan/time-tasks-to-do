const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.postCreateaccount = (req, res, next) => {
  const { InputUsername, InputPassword, InputConfirmPassword } = req.body;
  let errors = [];

  // Check required fields
  if (!InputUsername || !InputPassword || !InputConfirmPassword) {
    errors.push({ msg: "Please fill in all fields" });
  }
  // Check password
  if (InputPassword !== InputConfirmPassword) {
    errors.push({ msg: "Passwords do not match" });
  }
  // Check password length
  if (InputPassword.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }
  if (errors.length > 0) {
    res.render("create_account", {
      errors,
      InputUsername,
      InputPassword,
      InputConfirmPassword,
      title: "Log in",
    });
  } else {
    bcrypt.hash(InputPassword, 10, function (err, hashedPass) {
      if (err) {
        console.log(err);
      }
      new User({
        username: InputUsername,
        password: hashedPass,
      })
        .save()
        .then((result) => {
          res.redirect("/mainpage");
        })
        .catch((err) => {
          errors.push({ msg: "Username already exist" });
          res.render("create_account", {
            errors,
            InputUsername,
            InputPassword,
            InputConfirmPassword,
            title: "Log in",
          });
        });
    });
  }
};

exports.login = (req, res, next) => {
  const Username = req.body.Username;
  const Password = req.body.Password;

  User.findOne({ $or: [{ username: Username }] }).then((user) => {
    if (user) {
      bcrypt.compare(Password, user.password, function (err, result) {
        if (err) {
          res.render("index", {
            error: err,
            title: "Home",
            req: req,
          });
          console.log(err);
        }
        if (result) {
          const token = jwt.sign(
            { id: user._id, username: user.username, tasks: user.tasks },
            "verySecretValue",
            {
              expiresIn: "1h",
            }
          );
          res.cookie("token", token, {
            expiresIn: "1h",
          });
          res.redirect("/");
        } else {
          res.render("index", {
            error: "Password does not matched",
            title: "Home",
            req: req,
          });
          console.log("Password does not matched");
        }
      });
    } else {
      res.render("index", {
        error: "User not found",
        title: "Home",
        req: req,
      });
      console.log("User not found");
    }
  });
};
exports.logout = (req, res, next) => {
  return res.clearCookie("token").then(res.redirect("/"));
};
