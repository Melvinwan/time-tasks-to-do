const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
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
      req: req,
    });
  } else {
    bcrypt.hash(
      InputPassword,
      Number(process.env.SALTED_HASH),
      function (err, hashedPass) {
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
              req: req,
            });
          });
      }
    );
  }
};

exports.login = (req, res, next) => {
  const Username = req.body.Username;
  const Password = req.body.Password;
  const secret = process.env.JWT_SECRET;
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
            secret,
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
exports.change_password = (req, res, next) => {
  const {
    InputUsername,
    InputCurrentPassword,
    InputNewPassword,
    InputNewConfirmPassword,
  } = req.body;
  let errors = [];
  // Check required fields
  if (
    !InputUsername ||
    !InputCurrentPassword ||
    !InputNewPassword ||
    !InputNewConfirmPassword
  ) {
    errors.push({ msg: "Please fill in all fields" });
  }
  // Check new password
  if (InputNewPassword !== InputNewConfirmPassword) {
    errors.push({ msg: "Passwords do not match" });
  }

  // Check new password length
  if (InputNewPassword.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }
  // Check current and new password
  if (InputNewPassword == InputCurrentPassword) {
    errors.push({ msg: "Please create a new password" });
  }
  if (errors.length > 0) {
    res.render("change_password", {
      errors,
      title: "Log in",
      req: req,
    });
  } else {
    User.findOne({ $or: [{ username: InputUsername }] }).then((user) => {
      if (user) {
        bcrypt.compare(
          InputCurrentPassword,
          user.password,
          function (err, result) {
            if (err) {
              res.render("change_password", {
                error: err,
                title: "Change Password",
                req: req,
              });
              console.log(err);
            }
            if (result) {
              bcrypt.hash(
                InputNewPassword,
                Number(process.env.SALTED_HASH),
                function (err, hashedPass) {
                  if (err) {
                    console.log(err);
                  }
                  const update = {
                    username: InputUsername,
                    password: hashedPass,
                  };
                  const options = { new: true };
                  User.findByIdAndUpdate(user._id, update, options)
                    .then((result) => {
                      res.redirect("/");
                    })
                    .catch((err) => console.log(err));
                }
              );
            } else {
              res.render("change_password", {
                error: "Current password does not matched",
                title: "Change Password",
                req: req,
              });
              console.log("Current password does not matched");
            }
          }
        );
      } else {
        res.render("change_password", {
          error: "User not found",
          title: "Change Password",
          req: req,
        });
        console.log("User not found");
      }
    });
  }
};
exports.logout = (req, res, next) => {
  return res.clearCookie("token").then(res.redirect("/"));
};
