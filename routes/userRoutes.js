const express = require("express");
const path = require("path");
const userController = require("../controllers/userController");

const router = express.Router();

// Register Handle
router.post("/create_account", userController.postCreateaccount);
router.post("/", userController.login);
router.post("/logout", userController.logout);

module.exports = router;
