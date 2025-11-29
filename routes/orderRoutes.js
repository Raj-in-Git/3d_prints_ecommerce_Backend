const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");



// Admin routes
router.get("/", getOrders);
router.put("/:id", updateOrder);
router.delete("/:id", deleteOrder);

// Optional: Create order (can also be public for frontend users)
router.post("/", createOrder);

module.exports = router;
