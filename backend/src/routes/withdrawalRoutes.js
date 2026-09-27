const express = require("express");

const {
  createWithdrawal,
  getMyWithdrawals,
  getWithdrawalById,
} = require("../controllers/withdrawalController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/withdrawals
router.post("/", authMiddleware, createWithdrawal);

// GET /api/withdrawals
router.get("/", authMiddleware, getMyWithdrawals);

// GET /api/withdrawals/:id
router.get("/:id", authMiddleware, getWithdrawalById);

module.exports = router;