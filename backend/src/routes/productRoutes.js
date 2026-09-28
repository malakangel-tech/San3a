
const express = require("express");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const allowRoles = require("../middleware/roleMiddleware");
const { validateProduct } = require("../middleware/validationMiddleware");

const router = express.Router();

// GET /api/products
// متاح للجميع
router.get("/", getProducts);

// GET /api/products/:id
// متاح للجميع
router.get("/:id", getProductById);

// POST /api/products
// Admin أو Vendor فقط
router.post(
  "/",
  authMiddleware,
  allowRoles("admin", "vendor"),
  validateProduct,
  createProduct
);

// PUT /api/products/:id
// Admin أو Vendor فقط
router.put(
  "/:id",
  authMiddleware,
  allowRoles("admin", "vendor"),
  validateProduct,
  updateProduct
);

// DELETE /api/products/:id
// Admin فقط
router.delete(
  "/:id",
  authMiddleware,
  allowRoles("admin"),
  deleteProduct
);

module.exports = router;
