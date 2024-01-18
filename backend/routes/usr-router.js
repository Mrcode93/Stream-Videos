const express = require("express");
const router = express.Router();
const {
  Login,
  Register,
  getUserById,
  getUsers,
  updateUserByID,
} = require("../controller/user-controller"); // Import the user controller
const { authurizer } = require("../middleWare/authorizeUser");
const User = require("../models/userModel");
const multer = require("multer");
const gridfs = require("multer-gridfs-storage");

router.post("/register", Register); // Use the register function from the imported controller
router.post("/login", Login); // Use the login function from the imported controller

router.get("/", authurizer, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.json(user);
  } catch (error) {
    console.log(error);
  }
});
// !get the user by its id
router.get("/users/:id", getUserById);
// ! update the user informations
router.put("/update/:id", updateUserByID);

//! get all users
router.get("/users", getUsers);
module.exports = router;
