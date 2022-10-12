const express = require("express");
const path = require("path");
const userController = require("../controllers/userController");
const login = require("../login");

const router = express.Router();

// Register Handle
router.post("/create_account", userController.postCreateaccount);
router.post("/login", userController.login);

module.exports = router;
