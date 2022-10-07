const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  date_deadline: {
    type: Number,
    required: true,
  },
  time_deadline: { type: Number, required: false },
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

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
