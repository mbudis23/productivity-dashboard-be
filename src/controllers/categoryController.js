const Category = require("../models/Category");

// Create a category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description, user_id: req.user.id });
    await category.save();

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all categories for the authenticated user
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ user_id: req.user.id });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findOneAndUpdate(
      { _id: id, user_id: req.user.id },
      { name, description, updated_at: Date.now() },
      { new: true }
    );

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOneAndDelete({
      _id: id,
      user_id: req.user.id,
    });

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
