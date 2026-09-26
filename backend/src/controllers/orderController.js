
const pool = require("../config/db");

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      shippingAddress,
    } = req.body;

    // userId يأتي من JWT وليس من body
    const userId = req.user.id;

    // التحقق من البيانات
    if (
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      totalAmount === undefined ||
      !shippingAddress
    ) {
      return res.status(400).json({
        message: "items, totalAmount and shippingAddress are required",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO orders (
        user_id,
        items,
        total_amount,
        shipping_address
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        userId,
        JSON.stringify(items),
        totalAmount,
        shippingAddress,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    // المستخدم يشوف طلباته هو فقط
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT *
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
};
