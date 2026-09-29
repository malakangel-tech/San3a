const express = require("express");

const {
  addMessage,
  getChatHistory,
  getCustomOrderChatHistory,
  deleteCustomOrderChatHistory,
} = require("../controllers/chatController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ============================================
// ADD CHAT MESSAGE
// POST /api/chat/messages
// ============================================

router.post(
  "/messages",
  authMiddleware,
  addMessage
);


// ============================================
// GET ALL USER CHAT HISTORY
// GET /api/chat/history
// ============================================

router.get(
  "/history",
  authMiddleware,
  getChatHistory
);


// ============================================
// GET CUSTOM ORDER CHAT HISTORY
// GET /api/chat/history/:custom_order_id
// ============================================

router.get(
  "/history/:custom_order_id",
  authMiddleware,
  getCustomOrderChatHistory
);


// ============================================
// DELETE CUSTOM ORDER CHAT HISTORY
// DELETE /api/chat/history/:custom_order_id
// ============================================

router.delete(
  "/history/:custom_order_id",
  authMiddleware,
  deleteCustomOrderChatHistory
);



module.exports = router;