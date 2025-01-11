const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  title: { type: String, required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Subtask", subtaskSchema);
