
const validateProduct = (req, res, next) => {
  const {
    title,
    price,
    rating,
    description,
    dimensions,
    material,
    categoryId,
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
  if (typeof price !== "number" || price < 0) {
    return res.status(400).json({
      message: "Price must be a positive number",
    });
  }

  // Rating validation
  if (
    rating !== undefined &&
    (typeof rating !== "number" || rating < 0 || rating > 5)
  ) {
    return res.status(400).json({
      message: "Rating must be between 0 and 5",
    });
  }

  // Title validation
  if (
    typeof title !== "object" ||
    !title.ar ||
    !title.en
  ) {
    return res.status(400).json({
      message: "Title must contain ar and en",
    });
  }

  next();
};

module.exports = {
  validateProduct,
};
