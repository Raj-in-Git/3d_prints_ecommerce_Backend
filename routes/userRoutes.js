const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();
const {
  getUsers,
  getUserById,
  deleteUser,
} = require("../controllers/userController");

router.get("/", getUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);
// TEMP: Create admin user
router.post("/create-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: true
    });
    res.status(201).json(user);
  } catch (err) {
    console.error("Create admin error:", err);
    res.status(500).json({ message: err.message });
}
});


module.exports = router;
