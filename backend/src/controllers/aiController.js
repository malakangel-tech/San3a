
const axios = require("axios");
const pool = require("../config/db");

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || "http://localhost:5000";


// ============================================
// ANALYZE FURNITURE REQUEST
// POST /api/ai/analyze-furniture
// ============================================

const analyzeFurniture = async (req, res) => {
  try {
    const { request, custom_order_id } = req.body;

    // --------------------------------------------
    // Validation
    // --------------------------------------------

    if (
      !request ||
      typeof request !== "string" ||
      !request.trim()
    ) {
      return res.status(400).json({
        message: "Furniture request is required",
      });
    }

    // --------------------------------------------
    // Check custom order ownership
    // --------------------------------------------

    if (custom_order_id) {
      const orderResult = await pool.query(
        `
        SELECT id
        FROM custom_orders
        WHERE id = $1
        AND user_id = $2
        `,
        [
          custom_order_id,
          req.user.id,
        ]
      );

      if (orderResult.rows.length === 0) {
        return res.status(404).json({
          message: "Custom order not found",
        });
      }
    }

    // --------------------------------------------
    // Call Python AI Service
    // --------------------------------------------

    const response = await axios.post(
      `${AI_SERVICE_URL}/api/v1/analyze-furniture`,
      {
        request: request.trim(),
      }
    );

    const aiResult = response.data;

    // --------------------------------------------
    // Search Products
    // --------------------------------------------

    let products = [];

    if (aiResult.furniture_type) {
      const productResult = await pool.query(
        `
        SELECT
          p.id,
          p.title,
          p.price,
          p.rating,
          p.reviews_count,
          p.is_customizable,
          p.description,
          p.dimensions,
          p.material,
          p.images,
          p.colors,
          p.category_id,
          p.vendor_id
        FROM products p
        WHERE
          (
            p.title::text ILIKE $1
            OR p.description ILIKE $1
            OR p.material ILIKE $1
          )
        ORDER BY
          p.rating DESC NULLS LAST,
          p.reviews_count DESC NULLS LAST
        LIMIT 10
        `,
        [
          `%${aiResult.furniture_type}%`,
        ]
      );

      products = productResult.rows;
    }

    // --------------------------------------------
    // Search Vendors
    // --------------------------------------------

    let vendors = [];

    const vendorConditions = [];
    const vendorValues = [];
    let valueIndex = 1;

    if (aiResult.furniture_type) {
      vendorConditions.push(
        `v.specialty ILIKE $${valueIndex}`
      );

      vendorValues.push(
        `%${aiResult.furniture_type}%`
      );

      valueIndex++;
    }

    let vendorQuery = `
      SELECT
        v.id,
        v.name,
        v.specialty,
        v.rating,
        v.verified,
        v.location,
        v.projects_count,
        v.experience,
        v.image,
        v.cover,
        v.about,
        v.portfolio,
        v.latitude,
        v.longitude,
        v.user_id
      FROM vendors v
    `;

    if (vendorConditions.length > 0) {
      vendorQuery += `
        WHERE ${vendorConditions.join(" AND ")}
      `;
    }

    vendorQuery += `
      ORDER BY
        v.verified DESC NULLS LAST,
        v.rating DESC NULLS LAST,
        v.projects_count DESC NULLS LAST
      LIMIT 10
    `;

    const vendorResult = await pool.query(
      vendorQuery,
      vendorValues
    );

    vendors = vendorResult.rows;

    // --------------------------------------------
    // Build recommendations
    // --------------------------------------------

    const recommendations = {
      products,
      vendors,
    };

    // --------------------------------------------
    // Save AI result to Custom Order
    // --------------------------------------------

    if (custom_order_id) {
      await pool.query(
        `
        UPDATE custom_orders
        SET
          ai_analysis = $1::jsonb,
          ai_recommendations = $2::jsonb,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        AND user_id = $4
        `,
        [
          JSON.stringify(aiResult),
          JSON.stringify(recommendations),
          custom_order_id,
          req.user.id,
        ]
      );
    }

    // --------------------------------------------
    // Response
    // --------------------------------------------

    return res.json({
      message: "Furniture analyzed successfully",

      analysis: aiResult,

      recommendations: {
        products,
        vendors,
      },

      custom_order_id:
        custom_order_id || null,
    });

  } catch (error) {

    console.error(
      "AI ANALYZE FURNITURE ERROR:",
      error.response?.data ||
      error.message
    );

    // --------------------------------------------
    // AI Service Error
    // --------------------------------------------

    if (error.response) {
      return res.status(
        error.response.status
      ).json({
        message: "AI service error",
        error: error.response.data,
      });
    }

    // --------------------------------------------
    // Database / Server Error
    // --------------------------------------------

    return res.status(500).json({
      message: "Failed to analyze furniture",
      error: error.message,
    });
  }
};


// ============================================
// CUSTOM DESIGN
// POST /api/ai/custom-design
// ============================================

const customDesign = async (req, res) => {
  try {
    const {
      furniture_type,
      dimensions,
      number_of_people,
      color_preference,
      wood_type,
      style,
      budget,
      additional_requirements,
      custom_order_id,
    } = req.body;

    // --------------------------------------------
    // Validation
    // --------------------------------------------

    if (
      !furniture_type ||
      typeof furniture_type !== "string" ||
      !furniture_type.trim()
    ) {
      return res.status(400).json({
        message: "Furniture type is required",
      });
    }

    // --------------------------------------------
    // Check custom order ownership
    // --------------------------------------------

    if (custom_order_id) {
      const orderResult = await pool.query(
        `
        SELECT id
        FROM custom_orders
        WHERE id = $1
        AND user_id = $2
        `,
        [
          custom_order_id,
          req.user.id,
        ]
      );

      if (orderResult.rows.length === 0) {
        return res.status(404).json({
          message: "Custom order not found",
        });
      }
    }

    // --------------------------------------------
    // Call Python AI Service
    // --------------------------------------------

    const response = await axios.post(
      `${AI_SERVICE_URL}/api/v1/custom-design`,
      {
        furniture_type: furniture_type.trim(),
        dimensions,
        number_of_people,
        color_preference,
        wood_type,
        style,
        budget,
        additional_requirements,
      }
    );

    const aiResult = response.data;

    // --------------------------------------------
    // Save Smart Design to Custom Order
    // --------------------------------------------

    if (custom_order_id) {
      await pool.query(
        `
        UPDATE custom_orders
        SET
          ai_analysis = $1::jsonb,
          ai_recommendations = $2::jsonb,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        AND user_id = $4
        `,
        [
          JSON.stringify(aiResult),
          JSON.stringify({
            custom_design: aiResult,
          }),
          custom_order_id,
          req.user.id,
        ]
      );
    }

    // --------------------------------------------
    // Response
    // --------------------------------------------

    return res.json({
      message: "Custom design generated successfully",

      design: aiResult,

      custom_order_id:
        custom_order_id || null,
    });

  } catch (error) {

    console.error(
      "AI CUSTOM DESIGN ERROR:",
      error.response?.data ||
      error.message
    );

    if (error.response) {
      return res.status(
        error.response.status
      ).json({
        message: "AI service error",
        error: error.response.data,
      });
    }

    return res.status(500).json({
      message: "Failed to generate custom design",
      error: error.message,
    });
  }
};


// ============================================
// ANALYZE FURNITURE IMAGE
// POST /api/ai/analyze-image
// ============================================

const analyzeFurnitureImage = async (req, res) => {
  try {

    const {
      custom_order_id,
      additional_request,
    } = req.body;

    // --------------------------------------------
    // Validate image
    // --------------------------------------------

    if (!req.file) {
      return res.status(400).json({
        message: "Furniture image is required",
      });
    }

    // --------------------------------------------
    // Check custom order ownership
    // --------------------------------------------

    if (custom_order_id) {

      const orderResult = await pool.query(
        `
        SELECT id
        FROM custom_orders
        WHERE id = $1
        AND user_id = $2
        `,
        [
          custom_order_id,
          req.user.id,
        ]
      );

      if (orderResult.rows.length === 0) {
        return res.status(404).json({
          message: "Custom order not found",
        });
      }
    }

    // --------------------------------------------
    // Prepare multipart form
    // --------------------------------------------

    const FormData = require("form-data");

    const form = new FormData();

    form.append(
      "image",
      req.file.buffer,
      {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
      }
    );

    if (additional_request) {
      form.append(
        "additional_request",
        additional_request
      );
    }

    // --------------------------------------------
    // Call Python AI Service
    // --------------------------------------------

    const response = await axios.post(
      `${AI_SERVICE_URL}/api/v1/analyze-image`,
      form,
      {
        headers: {
          ...form.getHeaders(),
        },

        maxContentLength:
          15 * 1024 * 1024,

        maxBodyLength:
          15 * 1024 * 1024,
      }
    );

    const aiResult = response.data;

    // ==================================================
    // IMPORTANT:
    // Check whether the uploaded image is actually furniture
    // ==================================================

    const isFurniture =
      aiResult.is_furniture === true;

    // ==================================================
    // NON-FURNITURE IMAGE
    // ==================================================

    if (!isFurniture) {

      console.log(
        "Image is not furniture. Skipping product/vendor search."
      );

      const recommendations = {
        products: [],
        vendors: [],
      };

      // --------------------------------------------
      // Save result to custom order if provided
      // --------------------------------------------

      if (custom_order_id) {

        await pool.query(
          `
          UPDATE custom_orders
          SET
            ai_analysis = $1::jsonb,
            ai_recommendations = $2::jsonb,
            updated_at = CURRENT_TIMESTAMP
          WHERE
            id = $3
            AND user_id = $4
          `,
          [
            JSON.stringify(aiResult),
            JSON.stringify(recommendations),
            custom_order_id,
            req.user.id,
          ]
        );
      }

      // --------------------------------------------
      // Save chat history
      // --------------------------------------------

      if (custom_order_id) {

        await pool.query(
          `
          INSERT INTO chat_messages (
            user_id,
            custom_order_id,
            role,
            message
          )
          VALUES ($1, $2, $3, $4)
          `,
          [
            req.user.id,
            custom_order_id,
            "assistant",
            "The uploaded image does not appear to contain furniture.",
          ]
        );
      }

      // --------------------------------------------
      // Response
      // --------------------------------------------

      return res.status(200).json({

        message:
          "Image analyzed, but it does not appear to contain furniture.",

        analysis: aiResult,

        recommendations: {
          products: [],
          vendors: [],
        },

        custom_order_id:
          custom_order_id || null,
      });
    }

    // ==================================================
    // FURNITURE IMAGE
    // Continue with product/vendor search
    // ==================================================

    // --------------------------------------------
    // Search matching products
    // --------------------------------------------

    let products = [];

    if (aiResult.furniture_type) {

      const productResult = await pool.query(
        `
        SELECT
          p.id,
          p.title,
          p.price,
          p.rating,
          p.reviews_count,
          p.is_customizable,
          p.description,
          p.dimensions,
          p.material,
          p.images,
          p.colors,
          p.category_id,
          p.vendor_id
        FROM products p
        WHERE
          (
            p.title::text ILIKE $1
            OR p.description ILIKE $1
            OR p.material ILIKE $1
          )
        ORDER BY
          p.rating DESC NULLS LAST,
          p.reviews_count DESC NULLS LAST
        LIMIT 10
        `,
        [
          `%${aiResult.furniture_type}%`,
        ]
      );

      products = productResult.rows;
    }

    // --------------------------------------------
    // Search vendors
    // --------------------------------------------

    let vendors = [];

    if (aiResult.furniture_type) {

      const vendorResult = await pool.query(
        `
        SELECT
          v.id,
          v.name,
          v.specialty,
          v.rating,
          v.verified,
          v.location,
          v.projects_count,
          v.experience,
          v.image,
          v.cover,
          v.about,
          v.portfolio,
          v.latitude,
          v.longitude,
          v.user_id
        FROM vendors v
        WHERE
          v.specialty ILIKE $1
        ORDER BY
          v.verified DESC NULLS LAST,
          v.rating DESC NULLS LAST,
          v.projects_count DESC NULLS LAST
        LIMIT 10
        `,
        [
          `%${aiResult.furniture_type}%`,
        ]
      );

      vendors = vendorResult.rows;

    } else {

      const vendorResult = await pool.query(
        `
        SELECT
          v.id,
          v.name,
          v.specialty,
          v.rating,
          v.verified,
          v.location,
          v.projects_count,
          v.experience,
          v.image,
          v.cover,
          v.about,
          v.portfolio,
          v.latitude,
          v.longitude,
          v.user_id
        FROM vendors v
        ORDER BY
          v.verified DESC NULLS LAST,
          v.rating DESC NULLS LAST,
          v.projects_count DESC NULLS LAST
        LIMIT 10
        `
      );

      vendors = vendorResult.rows;
    }

    // --------------------------------------------
    // Recommendations
    // --------------------------------------------

    const recommendations = {
      products,
      vendors,
    };

    // --------------------------------------------
    // Save result to custom order
    // --------------------------------------------

    if (custom_order_id) {

      await pool.query(
        `
        UPDATE custom_orders
        SET
          ai_analysis = $1::jsonb,
          ai_recommendations = $2::jsonb,
          updated_at = CURRENT_TIMESTAMP
        WHERE
          id = $3
          AND user_id = $4
        `,
        [
          JSON.stringify(aiResult),
          JSON.stringify(recommendations),
          custom_order_id,
          req.user.id,
        ]
      );
    }

    // --------------------------------------------
    // Save chat history
    // --------------------------------------------

    if (custom_order_id) {

      await pool.query(
        `
        INSERT INTO chat_messages (
          user_id,
          custom_order_id,
          role,
          message
        )
        VALUES ($1, $2, $3, $4)
        `,
        [
          req.user.id,
          custom_order_id,
          "assistant",
          `Image analysis: ${
            aiResult.description ||
            aiResult.furniture_type ||
            "Furniture image analyzed successfully."
          }`,
        ]
      );
    }

    // --------------------------------------------
    // Response
    // --------------------------------------------

    return res.json({

      message:
        "Furniture image analyzed successfully",

      analysis: aiResult,

      recommendations: {
        products,
        vendors,
      },

      custom_order_id:
        custom_order_id || null,
    });

  } catch (error) {

    console.error(
      "AI ANALYZE IMAGE ERROR:",
      error.response?.data ||
      error.message
    );

    // --------------------------------------------
    // AI Service Error
    // --------------------------------------------

    if (error.response) {

      return res.status(
        error.response.status
      ).json({
        message: "AI service error",
        error: error.response.data,
      });
    }

    // --------------------------------------------
    // Server / Database Error
    // --------------------------------------------

    return res.status(500).json({
      message:
        "Failed to analyze furniture image",

      error: error.message,
    });
  }
};


// ============================================
// EXPORTS
// ============================================

module.exports = {
  analyzeFurniture,
  customDesign,
  analyzeFurnitureImage,
};
