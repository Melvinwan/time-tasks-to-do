const User = require("../models/user");
const login = require("../login");

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
    new User({
      username: req.body.InputUsername,
      password: req.body.InputPassword,
    })
      .save()
      .then((result) => {
        res.redirect("/mainpage");
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
