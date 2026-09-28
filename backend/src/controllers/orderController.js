const pool = require("../config/db");

// ============================================
// POST /api/orders
// Create order + commission + vendor earnings
// ============================================
const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      items,
      totalAmount,
      shippingAddress,
    } = req.body;

    // User ID comes from JWT
    const userId = req.user.id;

    // ============================================
    // Validation
    // ============================================
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

    // Validate total amount
    if (Number(totalAmount) <= 0) {
      return res.status(400).json({
        message: "totalAmount must be greater than 0",
      });
    }

    // ============================================
    // Commission
    // 10% commission
    // ============================================
    const COMMISSION_RATE = 0.10;

    const commission = Number(
      (Number(totalAmount) * COMMISSION_RATE).toFixed(2)
    );

    // ============================================
    // Calculate vendor earnings
    // ============================================
    const vendorTotals = {};

    for (const item of items) {
      const vendorId = item.vendorId;
      const price = Number(item.price);
      const quantity = Number(item.quantity || 1);

      if (!vendorId) {
        return res.status(400).json({
          message: "Each item must have vendorId",
        });
      }

      if (!price || price <= 0) {
        return res.status(400).json({
          message: "Each item must have a valid price",
        });
      }

      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          message: "Each item must have a valid quantity",
        });
      }

      const itemTotal = price * quantity;

      if (!vendorTotals[vendorId]) {
        vendorTotals[vendorId] = 0;
      }

      vendorTotals[vendorId] += itemTotal;
    }

    // ============================================
    // Start transaction
    // ============================================
    await client.query("BEGIN");

    // ============================================
    // Create order
    // ============================================
    const orderResult = await client.query(
      `
      INSERT INTO orders (
        user_id,
        items,
        total_amount,
        shipping_address,
        status
      )
      VALUES ($1, $2, $3, $4, 'processing')
      RETURNING *
      `,
      [
        userId,
        JSON.stringify(items),
        totalAmount,
        shippingAddress,
      ]
    );

    const order = orderResult.rows[0];
    // ============================================
// Create notification for the user
// ============================================
await client.query(
  `
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    reference_type,
    reference_id
  )
  VALUES ($1, $2, $3, $4, $5, $6)
  `,
  [
    userId,
    "Order Created",
    `Your order #${order.id} has been created successfully.`,
    "order",
    "order",
    order.id,
  ]
);

    // ============================================
    // Process each vendor
    // ============================================
    const vendorEarnings = [];

    for (const [vendorId, vendorTotal] of Object.entries(
      vendorTotals
    )) {
      // Get vendor's user
      const vendorResult = await client.query(
        `
        SELECT id, name, user_id
        FROM vendors
        WHERE id = $1
        `,
        [vendorId]
      );

      if (vendorResult.rows.length === 0) {
        throw new Error(`Vendor ${vendorId} not found`);
      }

      const vendor = vendorResult.rows[0];

      if (!vendor.user_id) {
        throw new Error(
          `Vendor ${vendorId} is not connected to a user`
        );
      }

      // ============================================
      // Calculate vendor commission
      // ============================================
      const vendorCommission = Number(
        (vendorTotal * COMMISSION_RATE).toFixed(2)
      );

      const earning = Number(
        (vendorTotal - vendorCommission).toFixed(2)
      );

      // ============================================
      // Get or create vendor wallet
      // ============================================
      let walletResult = await client.query(
        `
        SELECT *
        FROM wallets
        WHERE user_id = $1
        FOR UPDATE
        `,
        [vendor.user_id]
      );

      if (walletResult.rows.length === 0) {
        walletResult = await client.query(
          `
          INSERT INTO wallets (
            user_id,
            balance,
            total_earnings,
            total_expenses,
            total_commission
          )
          VALUES ($1, 0, 0, 0, 0)
          RETURNING *
          `,
          [vendor.user_id]
        );
      }

      const wallet = walletResult.rows[0];

      // ============================================
      // Update vendor wallet
      // ============================================
      const updatedWallet = await client.query(
        `
        UPDATE wallets
        SET
          balance = balance + $1,
          total_earnings = total_earnings + $1,
          total_commission = total_commission + $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING *
        `,
        [
          earning,
          vendorCommission,
          wallet.id,
        ]
      );

      // ============================================
      // Add earning transaction
      // ============================================
      await client.query(
        `
        INSERT INTO wallet_transactions (
          wallet_id,
          type,
          amount,
          description,
          reference_type,
          reference_id,
          status
        )
        VALUES (
          $1,
          'earning',
          $2,
          $3,
          'order',
          $4,
          'completed'
        )
        `,
        [
          wallet.id,
          earning,
          `Earning from Order #${order.id}`,
          order.id,
        ]
      );

      // ============================================
      // Add commission transaction
      // ============================================
      await client.query(
        `
        INSERT INTO wallet_transactions (
          wallet_id,
          type,
          amount,
          description,
          reference_type,
          reference_id,
          status
        )
        VALUES (
          $1,
          'commission',
          $2,
          $3,
          'order',
          $4,
          'completed'
        )
        `,
        [
          wallet.id,
          vendorCommission,
          `Commission for Order #${order.id}`,
          order.id,
        ]
      );

      vendorEarnings.push({
        vendorId: Number(vendorId),
        vendorName: vendor.name,
        vendorTotal,
        commission: vendorCommission,
        earning,
        walletBalance: updatedWallet.rows[0].balance,
      });
    }

    // ============================================
    // Commit transaction
    // ============================================
    await client.query("COMMIT");

    // ============================================
    // Response
    // ============================================
    res.status(201).json({
      message: "Order created successfully",
      order,
      financialSummary: {
        totalAmount: Number(totalAmount),
        commission,
        vendorEarnings,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("CREATE ORDER ERROR:", error);

    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

// ============================================
// GET /api/orders
// Get current user's orders
// ============================================
const getOrders = async (req, res) => {
  try {
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