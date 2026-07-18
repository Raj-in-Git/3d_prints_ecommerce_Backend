const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Set storage for uploaded images
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // folder to store images
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname)); // unique filename
//   }
// });
// const upload = multer({ storage });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "visei-products",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// Routes
// router.post("/", authMiddleware, adminMiddleware, upload.array("images", 5), createProduct);
// // router.post("/", upload.array("images", 5), createProduct);
// router.get("/", getProducts);
// router.get("/:id", getProductById);
// router.put("/:id", authMiddleware, adminMiddleware, upload.array("images", 5), updateProduct);
// router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);


router.post("/" , upload.array("images", 5), createProduct);
// router.post("/", upload.array("images", 5), createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.put("/:id", upload.array("images", 5), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
