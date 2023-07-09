function validator(validate) {
  return (req, res, next) => {
    const { error } = validate(req.body);
    if (error)return res.status(400).json({ status: false, message: error.details[0].message });

    next();
  };
}

module.exports = validator;
