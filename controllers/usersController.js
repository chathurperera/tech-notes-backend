const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Note = require("../models/Note");

// @desc get all users
// @route GET /users
// @access private

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users) {
    return res.status(400).json({ message: "No Users Found" });
  }
  res.json(users);
});

// @desc create user
// @route POST /users
// @access private

const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  // Confirm data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //Check for duplicate
  const duplicate = await User.find({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  //Hashing the password
  const hashedPassword = await bcrypt.hash(password, 10);
  const userObject = { username, password: hashedPassword, roles };

  //create and store user
  const user = await User.create({ userObject });

  if (user) {
    return res.status(201).json({ message: `New user ${username} created` });
  } else {
    return res.status(400).json({ message: "Invalid user data" });
  }
});

// @desc update user
// @route PATCH /users
// @access private

const updateUser = asyncHandler(async (req, res) => {});

// @desc delete user
// @route DELETE /users
// @access private

const deleteUser = asyncHandler(async (req, res) => {});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
