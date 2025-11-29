const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
// const productRoutes = require("./routes/productRoutes");
// const auth = require("./routes/auth");
// const path = require("path");


dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads")); // serve uploaded images
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/products", require("./routes/productRoutes"));
app.use("/orders", require("./routes/orderRoutes"));
app.use("/users", require("./routes/userRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
