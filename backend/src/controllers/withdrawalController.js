const pool = require("../config/db");

// ============================================
// POST /api/withdrawals
// Create withdrawal request
// ============================================
const createWithdrawal = async (req, res) => {
  const client = await pool.connect();

  try {
    const user_id = req.user.id;
    const {
      amount,
      method,
      account_details,
    } = req.body;

    // Validation
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    if (!method) {
      return res.status(400).json({
        message: "Withdrawal method is required",
      });
    }

    if (!account_details) {
      return res.status(400).json({
        message: "Account details are required",
      });
    }

    await client.query("BEGIN");

    // Get user's wallet
    const walletResult = await client.query(
      `
      SELECT *
      FROM wallets
      WHERE user_id = $1
      FOR UPDATE
      `,
      [user_id]
    );

    if (walletResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        message: "Wallet not found",
      });
    }

    const wallet = walletResult.rows[0];

    // Check balance
    if (Number(wallet.balance) < Number(amount)) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message: "Insufficient wallet balance",
      });
    }

    // Deduct amount from wallet
    const updatedWallet = await client.query(
      `
      UPDATE wallets
      SET
        balance = balance - $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [amount, wallet.id]
    );

    // Create withdrawal
    const withdrawalResult = await client.query(
      `
      INSERT INTO withdrawals (
        wallet_id,
        amount,
        method,
        account_details,
        status
      )
      VALUES ($1, $2, $3, $4, 'pending')
      RETURNING *
      `,
      [
        wallet.id,
        amount,
        method,
        account_details,
      ]
    );

    // Add wallet transaction
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
        'withdrawal',
        $2,
        $3,
        'withdrawal',
        $4,
        'completed'
      )
      `,
      [
        wallet.id,
        amount,
        "Wallet withdrawal",
        withdrawalResult.rows[0].id,
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Withdrawal request created successfully",
      withdrawal: withdrawalResult.rows[0],
      wallet: updatedWallet.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("CREATE WITHDRAWAL ERROR:", error);

    res.status(500).json({
      message: "Failed to create withdrawal",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

// ============================================
// GET /api/withdrawals
// Get current user's withdrawals
// ============================================
const getMyWithdrawals = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `
      SELECT
        wd.*
      FROM withdrawals wd
      INNER JOIN wallets w
        ON wd.wallet_id = w.id
      WHERE w.user_id = $1
      ORDER BY wd.created_at DESC
      `,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET WITHDRAWALS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch withdrawals",
      error: error.message,
    });
  }
};

// ============================================
// GET /api/withdrawals/:id
// Get withdrawal by ID
// ============================================
const getWithdrawalById = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        wd.*
      FROM withdrawals wd
      INNER JOIN wallets w
        ON wd.wallet_id = w.id
      WHERE wd.id = $1
      AND w.user_id = $2
      `,
      [id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Withdrawal not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("GET WITHDRAWAL ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch withdrawal",
      error: error.message,
    });
  }
};

module.exports = {
  createWithdrawal,
  getMyWithdrawals,
  getWithdrawalById,
};