
const pool = require("../config/db");

// GET /api/products
const getProducts = async (req, res) => {
  try {
    const { search, categoryId, vendorId } = req.query;

    let query = `
      SELECT *
      FROM products
      WHERE 1=1
    `;

    const values = [];

    if (search) {
      values.push(`%${search}%`);

      query += ` AND (
        title->>'ar' ILIKE $${values.length}
        OR title->>'en' ILIKE $${values.length}
        OR description ILIKE $${values.length}
      )`;
    }

    if (categoryId) {
      values.push(categoryId);
      query += ` AND category_id = $${values.length}`;
    }

    if (vendorId) {
      values.push(vendorId);
      query += ` AND vendor_id = $${values.length}`;
    }

    query += ` ORDER BY id DESC`;

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      rating,
      reviewsCount,
      isCustomizable,
      description,
      dimensions,
      material,
      images,
      colors,
      categoryId,
      vendorId,
    } = req.body;

    const result = await pool.query(
      `
      INSERT INTO products (
        title,
        price,
        rating,
        reviews_count,
        is_customizable,
        description,
        dimensions,
        material,
        images,
        colors,
        category_id,
        vendor_id
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10, $11, $12
      )
      RETURNING *
      `,
      [
        JSON.stringify(title),
        price,
        rating ?? 0,
        reviewsCount ?? 0,
        isCustomizable ?? false,
        description,
        dimensions,
        material,
        images ?? [],
        JSON.stringify(colors ?? []),
        categoryId ?? null,
        vendorId ?? null,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Failed to create product",
      error: error.message,
    });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      price,
      rating,
      reviewsCount,
      isCustomizable,
      description,
      dimensions,
      material,
      images,
      colors,
      categoryId,
      vendorId,
    } = req.body;

    const result = await pool.query(
      `
      UPDATE products
      SET
        title = $1,
        price = $2,
        rating = $3,
        reviews_count = $4,
        is_customizable = $5,
        description = $6,
        dimensions = $7,
        material = $8,
        images = $9,
        colors = $10,
        category_id = $11,
        vendor_id = $12
      WHERE id = $13
      RETURNING *
      `,
      [
        JSON.stringify(title),
        price,
        rating,
        reviewsCount,
        isCustomizable,
        description,
        dimensions,
        material,
        images ?? [],
        JSON.stringify(colors ?? []),
        categoryId ?? null,
        vendorId ?? null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
      product: result.rows[0],
    });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);

    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
