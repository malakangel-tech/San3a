
const express = require("express");

const {
  createCustomOrder,
  getMyCustomOrders,
  getCustomOrderById,
  updateCustomOrder,
  deleteCustomOrder,
  updateCustomOrderStatus,
} = require("../controllers/customOrderController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/custom-orders
router.post("/", authMiddleware, createCustomOrder);

// GET /api/custom-orders
router.get("/", authMiddleware, getMyCustomOrders);

// PUT /api/custom-orders/:id/status
router.put(
  "/:id/status",
  authMiddleware,
  updateCustomOrderStatus
);

// GET /api/custom-orders/:id
router.get("/:id", authMiddleware, getCustomOrderById);

// PUT /api/custom-orders/:id
router.put("/:id", authMiddleware, updateCustomOrder);

// DELETE /api/custom-orders/:id
router.delete("/:id", authMiddleware, deleteCustomOrder);

module.exports = router;
