
const validateProduct = (req, res, next) => {
  const {
    title,
    price,
    rating,
    description,
    dimensions,
    material,
    categoryId,
    images,
  } = req.body;

  // Required fields
  if (!title || !description || !dimensions || !material || !categoryId) {
    return res.status(400).json({
      message: "Required product fields are missing",
    });
  }

  // Price is required
  if (price === undefined || price === null) {
    return res.status(400).json({
      message: "Price is required",
    });
  }

  // Price validation
  if (typeof price !== "number" || !Number.isFinite(price) || price < 0) {
    return res.status(400).json({
      message: "Price must be a positive number",
    });
  }

  // Rating validation
  if (
    rating !== undefined &&
    (typeof rating !== "number" ||
      !Number.isFinite(rating) ||
      rating < 0 ||
      rating > 5)
  ) {
    return res.status(400).json({
      message: "Rating must be between 0 and 5",
    });
  }

  // Title validation
  if (
    typeof title !== "object" ||
    Array.isArray(title) ||
    !title.ar ||
    !title.en
  ) {
    return res.status(400).json({
      message: "Title must contain ar and en",
    });
  }

  // Title language values validation
  if (
    typeof title.ar !== "string" ||
    typeof title.en !== "string" ||
    !title.ar.trim() ||
    !title.en.trim()
  ) {
    return res.status(400).json({
      message: "Arabic and English titles must be valid text",
    });
  }

  // Category ID validation
  if (
    !Number.isInteger(Number(categoryId)) ||
    Number(categoryId) <= 0
  ) {
    return res.status(400).json({
      message: "Category ID must be a positive number",
    });
  }

  // Description validation
  if (
    typeof description !== "string" ||
    !description.trim()
  ) {
    return res.status(400).json({
      message: "Description must be valid text",
    });
  }

  // Dimensions validation
  if (
    typeof dimensions !== "string" ||
    !dimensions.trim()
  ) {
    return res.status(400).json({
      message: "Dimensions must be valid text",
    });
  }

  // Material validation
  if (
    typeof material !== "string" ||
    !material.trim()
  ) {
    return res.status(400).json({
      message: "Material must be valid text",
    });
  }

  // Images validation
  if (images !== undefined) {
    if (!Array.isArray(images)) {
      return res.status(400).json({
        message: "Images must be an array",
      });
    }

    for (const image of images) {
      if (typeof image !== "string" || !image.trim()) {
        return res.status(400).json({
          message: "Each image must be a valid string",
        });
      }
    }
  }

  next();
};

module.exports = {
  validateProduct,
};
