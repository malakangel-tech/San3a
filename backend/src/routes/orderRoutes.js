
const express = require("express");

const {
  createOrder,
  getOrders,
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// لازم المستخدم يكون مسجل دخول
router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getOrders);

module.exports = router;
