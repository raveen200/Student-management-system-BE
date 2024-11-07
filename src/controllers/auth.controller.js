const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Generate JWT Token
const generateToken = (user) => {
  try {
    console.log(`process.env.JWT_SECRET value:`, process.env.JWT_SECRET);
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );
    console.log(`Generated Token:`, token);
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      profilePicture: req.file ? req.file.path : undefined,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
