const Task = require("../models/Task");

// Create a task
exports.createTask = async (req, res) => {
  try {
    const { category_id, title, description, priority, due_date, reminder } =
      req.body;

    const task = new Task({
      user_id: req.user.id,
      category_id,
      title,
      description,
      priority,
      due_date,
      reminder,
    });

    await task.save();

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all tasks for the authenticated user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user_id: req.user.id }).populate(
      "category_id"
    );
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, due_date, reminder } =
      req.body;

    const task = await Task.findOneAndUpdate(
      { _id: id, user_id: req.user.id },
      {
        title,
        description,
        priority,
        status,
        due_date,
        reminder,
        updated_at: Date.now(),
      },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, user_id: req.user.id });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
