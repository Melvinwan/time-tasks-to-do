const User = require("../models/user");
const login = require("../login");
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
      login: login,
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
            login: login,
          });
        });
    });
  }
};

exports.login = (req, res, next) => {
  var Username = req.body.Username;
  var Password = req.body.Password;

  User.findOne({ $or: [{ username: Username }] }).then((user) => {
    if (user) {
      bcrypt.compare(Password, user.password, function (err, result) {
        if (err) {
          console.log(err);
        }
        if (result) {
          let token = jwt.sign({ username: user.name }, "verySecretValue", {
            expiresIn: "1h",
          });
          req.user = user;
          res.redirect("/");
          next();
        } else {
          alert("Password does not matched");
        }
      });
    } else {
      alert("User not found");
    }
  });
};
