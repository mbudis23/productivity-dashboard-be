const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Set the token in an HTTP-only cookie
    res
      .cookie("token", token, {
        httpOnly: true, // Prevents client-side access
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Protects against CSRF attacks
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      })
      .json({
        message: "Login successful",
        user: { id: user._id, username: user.username, email: user.email },
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
