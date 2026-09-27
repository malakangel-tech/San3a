const pool = require("../config/db");

// ============================================
// GET /api/wallet
// Get current user's wallet
// ============================================
const getWallet = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Get wallet
    let walletResult = await pool.query(
      `
      SELECT *
      FROM wallets
      WHERE user_id = $1
      `,
      [user_id]
    );

    // Create wallet if user doesn't have one
    if (walletResult.rows.length === 0) {
      walletResult = await pool.query(
        `
        INSERT INTO wallets (user_id)
        VALUES ($1)
        RETURNING *
        `,
        [user_id]
      );
    }

    res.json(walletResult.rows[0]);
  } catch (error) {
    console.error("GET WALLET ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch wallet",
      error: error.message,
    });
  }
};

// ============================================
// GET /api/wallet/transactions
// Get wallet transactions
// ============================================
const getWalletTransactions = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Get wallet
    const walletResult = await pool.query(
      `
      SELECT id
      FROM wallets
      WHERE user_id = $1
      `,
      [user_id]
    );

    if (walletResult.rows.length === 0) {
      return res.json([]);
    }

    const wallet_id = walletResult.rows[0].id;

    const result = await pool.query(
      `
      SELECT *
      FROM wallet_transactions
      WHERE wallet_id = $1
      ORDER BY created_at DESC
      `,
      [wallet_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET WALLET TRANSACTIONS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch wallet transactions",
      error: error.message,
    });
  }
};

// ============================================
// POST /api/wallet/deposit
// Deposit money
// ============================================
const depositMoney = async (req, res) => {
  const client = await pool.connect();

  try {
    const user_id = req.user.id;
    const { amount, description } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    await client.query("BEGIN");

    // Get or create wallet
    let walletResult = await client.query(
      `
      SELECT *
      FROM wallets
      WHERE user_id = $1
      FOR UPDATE
      `,
      [user_id]
    );

    if (walletResult.rows.length === 0) {
      walletResult = await client.query(
        `
        INSERT INTO wallets (user_id)
        VALUES ($1)
        RETURNING *
        `,
        [user_id]
      );
    }

    const wallet = walletResult.rows[0];

    // Update balance
    const updatedWallet = await client.query(
      `
      UPDATE wallets
      SET
        balance = balance + $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [amount, wallet.id]
    );

    // Add transaction
    await client.query(
      `
      INSERT INTO wallet_transactions (
        wallet_id,
        type,
        amount,
        description
      )
      VALUES ($1, 'deposit', $2, $3)
      `,
      [
        wallet.id,
        amount,
        description || "Wallet deposit",
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Money deposited successfully",
      wallet: updatedWallet.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("DEPOSIT ERROR:", error);

    res.status(500).json({
      message: "Failed to deposit money",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

// ============================================
// POST /api/wallet/expense
// Add expense
// ============================================
const addExpense = async (req, res) => {
  const client = await pool.connect();

  try {
    const user_id = req.user.id;
    const { amount, description } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0",
      });
    }

    await client.query("BEGIN");

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

    // Update wallet
    const updatedWallet = await client.query(
      `
      UPDATE wallets
      SET
        balance = balance - $1,
        total_expenses = total_expenses + $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
      `,
      [amount, wallet.id]
    );

    // Add transaction
    await client.query(
      `
      INSERT INTO wallet_transactions (
        wallet_id,
        type,
        amount,
        description
      )
      VALUES ($1, 'expense', $2, $3)
      `,
      [
        wallet.id,
        amount,
        description || "Wallet expense",
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Expense added successfully",
      wallet: updatedWallet.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error("EXPENSE ERROR:", error);

    res.status(500).json({
      message: "Failed to add expense",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

// ============================================
// GET /api/wallet/earnings
// Get earnings
// ============================================
const getEarnings = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `
      SELECT
        wt.*
      FROM wallet_transactions wt
      INNER JOIN wallets w
        ON wt.wallet_id = w.id
      WHERE w.user_id = $1
      AND wt.type = 'earning'
      ORDER BY wt.created_at DESC
      `,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET EARNINGS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch earnings",
      error: error.message,
    });
  }
};

// ============================================
// GET /api/wallet/expenses
// Get expenses
// ============================================
const getExpenses = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `
      SELECT
        wt.*
      FROM wallet_transactions wt
      INNER JOIN wallets w
        ON wt.wallet_id = w.id
      WHERE w.user_id = $1
      AND wt.type = 'expense'
      ORDER BY wt.created_at DESC
      `,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET EXPENSES ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch expenses",
      error: error.message,
    });
  }
};

// ============================================
// GET /api/wallet/commission
// Get commission transactions
// ============================================
const getCommission = async (req, res) => {
  try {
    const user_id = req.user.id;

    const result = await pool.query(
      `
      SELECT
        wt.*
      FROM wallet_transactions wt
      INNER JOIN wallets w
        ON wt.wallet_id = w.id
      WHERE w.user_id = $1
      AND wt.type = 'commission'
      ORDER BY wt.created_at DESC
      `,
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("GET COMMISSION ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch commission",
      error: error.message,
    });
  }
};

module.exports = {
  getWallet,
  getWalletTransactions,
  depositMoney,
  addExpense,
  getEarnings,
  getExpenses,
  getCommission,
};