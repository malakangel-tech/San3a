const pool = require("../config/db");

// GET /api/vendors
const getVendors = async (req, res) => {
  try {
    const { search } = req.query;

    let query = `
      SELECT *
      FROM vendors
      WHERE 1=1
    `;

    const values = [];

    if (search) {
      values.push(`%${search}%`);

      query += ` AND (
        name ILIKE $${values.length}
        OR specialty ILIKE $${values.length}
        OR location ILIKE $${values.length}
        OR about ILIKE $${values.length}
      )`;
    }

    query += ` ORDER BY id DESC`;

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (error) {
    console.error("GET VENDORS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch vendors",
      error: error.message,
    });
  }
};

// GET /api/vendors/:id
const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM vendors WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("GET VENDOR ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch vendor",
      error: error.message,
    });
  }
};

// POST /api/vendors
const createVendor = async (req, res) => {
  try {
    const {
      name,
      specialty,
      rating,
      verified,
      location,
      latitude,
      longitude,
      projectsCount,
      experience,
      image,
      cover,
      about,
      portfolio,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Vendor name is required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO vendors (
        name,
        specialty,
        rating,
        verified,
        location,
        latitude,
        longitude,
        projects_count,
        experience,
        image,
        cover,
        about,
        portfolio
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13
      )
      RETURNING *
      `,
      [
        name,
        specialty,
        rating ?? 0,
        verified ?? false,
        location,
        latitude ?? null,
        longitude ?? null,
        projectsCount ?? 0,
        experience ?? 0,
        image,
        cover,
        about,
        portfolio ?? [],
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("CREATE VENDOR ERROR:", error);

    res.status(500).json({
      message: "Failed to create vendor",
      error: error.message,
    });
  }
};

// PUT /api/vendors/:id
const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      specialty,
      rating,
      verified,
      location,
      latitude,
      longitude,
      projectsCount,
      experience,
      image,
      cover,
      about,
      portfolio,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE vendors
      SET
        name = $1,
        specialty = $2,
        rating = $3,
        verified = $4,
        location = $5,
        latitude = $6,
        longitude = $7,
        projects_count = $8,
        experience = $9,
        image = $10,
        cover = $11,
        about = $12,
        portfolio = $13
      WHERE id = $14
      RETURNING *
      `,
      [
        name,
        specialty,
        rating,
        verified,
        location,
        latitude ?? null,
        longitude ?? null,
        projectsCount,
        experience,
        image,
        cover,
        about,
        portfolio ?? [],
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("UPDATE VENDOR ERROR:", error);

    res.status(500).json({
      message: "Failed to update vendor",
      error: error.message,
    });
  }
};

// PUT /api/vendors/:id/location
const updateVendorLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;

    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        message: "Latitude and longitude are required",
      });
    }

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      return res.status(400).json({
        message: "Latitude and longitude must be numbers",
      });
    }

    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        message: "Latitude must be between -90 and 90",
      });
    }

    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        message: "Longitude must be between -180 and 180",
      });
    }

    const result = await pool.query(
      `
      UPDATE vendors
      SET
        latitude = $1,
        longitude = $2
      WHERE id = $3
      RETURNING *
      `,
      [latitude, longitude, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    res.json({
      message: "Vendor location updated successfully",
      vendor: result.rows[0],
    });
  } catch (error) {
    console.error("UPDATE VENDOR LOCATION ERROR:", error);

    res.status(500).json({
      message: "Failed to update vendor location",
      error: error.message,
    });
  }
};

// DELETE /api/vendors/:id
const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM vendors WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    res.json({
      message: "Vendor deleted successfully",
      vendor: result.rows[0],
    });
  } catch (error) {
    console.error("DELETE VENDOR ERROR:", error);

    res.status(500).json({
      message: "Failed to delete vendor",
      error: error.message,
    });
  }
};

module.exports = {
  getVendors,
  getVendorById,
  createVendor,
  updateVendor,
  updateVendorLocation,
  deleteVendor,
};