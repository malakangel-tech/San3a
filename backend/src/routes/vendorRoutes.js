const express = require("express");

const {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  updateVendorLocation,
  deleteVendor,
} = require("../controllers/vendorController");

const router = express.Router();

// GET all vendors
router.get("/", getVendors);

// GET vendor by ID
router.get("/:id", getVendorById);

// CREATE vendor
router.post("/", createVendor);

// UPDATE vendor
router.put("/:id", updateVendor);

// UPDATE vendor location
router.put("/:id/location", updateVendorLocation);

// DELETE vendor
router.delete("/:id", deleteVendor);

module.exports = router;