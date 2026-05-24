const Joi = require('joi');

module.exports = (schema) => {
  return (req, res, next) => {
    // Prefer validating req.body for most schemas
    const target = req.body && Object.keys(req.body).length ? req.body : req.params || req.query || {};
    const { error } = schema.validate(target);
    if (error) return res.status(400).json({ message: error.details[0].message });
    return next();
  };
};
