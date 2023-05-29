export const validator = (Schema) => async (req, res, next) => {
  try {
    let error = null;
    if (req.method === "GET") {
      const { error: err } = await Schema.validate(req.params);
      error = err;
    } else {
      const { error: err } = await Schema.validate(req.body);
      error = err;
    }
    if (error) {
      return res.status(400).json({
        error: {
          code: 400,
          message: error?.details[0]?.message || "Invalid schema",
        },
      });
    }
    next();
  } catch (error) {
    next(error);
  }
};
