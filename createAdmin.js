const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    await connectDB();

    // check if admin already exists
    const existing = await User.findOne({ email: "admin@example.com" });
    if (existing) {
      console.log("⚠️ Admin already exists:", existing.email);
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("Admin123", 10);

    const admin = await User.create({
      name: "Admin",
      email: "admin@example.com",
      password: hashedPassword,
      isAdmin: true,
    });

    console.log("✅ Admin created:", admin);
    process.exit();
  } catch (error) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
