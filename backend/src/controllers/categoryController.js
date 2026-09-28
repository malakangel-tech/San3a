
const pool = require("../config/db");

// GET /api/categories
const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET CATEGORIES ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// GET /api/categories/:id
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM categories WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("GET CATEGORY ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

// POST /api/categories
const createCategory = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Category name is required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO categories (
        name,
        description,
        image
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [
        JSON.stringify(name),
        description,
        image,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);

    res.status(500).json({
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// PUT /api/categories/:id
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      image,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE categories
      SET
        name = $1,
        description = $2,
        image = $3
      WHERE id = $4
      RETURNING *
      `,
      [
        JSON.stringify(name),
        description,
        image,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);

    res.status(500).json({
      message: "Failed to update category",
      error: error.message,
    });
  }
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json({
      message: "Category deleted successfully",
      category: result.rows[0],
    });
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);

    res.status(500).json({
      message: "Failed to delete category",
      error: error.message,
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
