// Catches any error that falls through to Express's error-handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error("Unhandled error:", err.stack || err.message);
  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
};

// Catches requests to routes that don't exist
export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found.`,
  });
};
