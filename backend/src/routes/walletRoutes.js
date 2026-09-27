const express = require("express");

const {
  getWallet,
  getWalletTransactions,
  depositMoney,
  addExpense,
  getEarnings,
  getExpenses,
  getCommission,
} = require("../controllers/walletController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/wallet
router.get("/", authMiddleware, getWallet);

// GET /api/wallet/transactions
router.get("/transactions", authMiddleware, getWalletTransactions);

// POST /api/wallet/deposit
router.post("/deposit", authMiddleware, depositMoney);

// POST /api/wallet/expense
router.post("/expense", authMiddleware, addExpense);

// GET /api/wallet/earnings
router.get("/earnings", authMiddleware, getEarnings);

// GET /api/wallet/expenses
router.get("/expenses", authMiddleware, getExpenses);

// GET /api/wallet/commission
router.get("/commission", authMiddleware, getCommission);

module.exports = router;