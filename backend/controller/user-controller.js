const express = require("express");
const User = require("../models/userModel");
const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mongoose = require("mongoose");
require("dotenv").config();
const { TOKEN_KEY, MONGO_URI } = process.env;

require("dotenv").config();

//* register user
exports.Register = async (req, res) => {
  const { name, email, password } = req.body;
  // const userEamil = email.toLowerCase();
  console.log(name, email, password);

  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log("User already exists");
      return res.status(400).json({ message: "User already exists try login" });
    }
    const hashedPassword = await bycript.hash(password, 10);

    user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    await user.save();
    return res
      .status(200)
      .json({ message: "User created successfully.", user: user });
  } catch (err) {
    console.log(err);
  }
};
// ! the procces of login logic
exports.Login = async (req, res) => {
  const { password } = req.body;
  // console.log(email, password);
  // const email = email.toLowerCase();
  // console.log(userEamil);

  try {
    let user = await User.findOne({
      email: req.body.email.toLowerCase(),
    });
    // console.log(user);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await bycript.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "password or email not match" });
    }
    const token = jwt.sign({ _id: user._id }, TOKEN_KEY, { expiresIn: "1hr" });
    res.cookie("token", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({
      email: user.email,
      userId: user._id,
      token: token,
      name: user.name,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: err.message });
  }
};

// ! get user by its id
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the post in the database by its ID
    const user = await User.findById(id);

    if (!user) {
      // If the post with the given ID is not found, return a 404 error
      return user.status(404).json({ error: "User not found" });
    }

    // If the post is found, send it as a response
    res.json(user);
  } catch (error) {
    // If there's any error while fetching the post, return a 500 error
    res
      .status(500)
      .json({ error: "An error occurred while fetching the post" });
  }
};
// ! get all users without passwords
exports.getUsers = async (req, res) => {
  try {
    // Use projection to exclude the password field
    const users = await User.find({}, { password: 0 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving data" });
  }
};

//! edit a user by id

exports.updateUserByID = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const update = { name, email };

  try {
    const user = await User.findByIdAndUpdate(id, update);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
