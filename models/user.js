const { result } = require("lodash");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Task = require("./task");
const taskSchema = new Schema({
  date_deadline: {
    type: String,
    required: true,
  },
  time_deadline: { type: String, required: false },
  task: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    required: true,
  },
  finished: {
    type: Boolean,
    required: true,
  },
  note: {
    type: String,
    required: false,
  },
});
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tasks: [taskSchema],
});

module.exports = mongoose.model("User", userSchema);
