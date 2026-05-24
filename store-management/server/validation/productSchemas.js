const Joi = require('joi');

exports.createProduct = Joi.object({
  store_id: Joi.number().integer().required(),
  part_name: Joi.string().required(),
  part_number: Joi.string().allow('', null).optional(),
  category: Joi.string().required(),
  description: Joi.string().allow('', null).required(),
  price: Joi.number().precision(2).required(),
  stock_quantity: Joi.number().integer().required(),
  compatibility: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('Available','Out of Stock','Discontinued').optional()
});

exports.updateProduct = Joi.object({
  part_name: Joi.string().optional(),
  part_number: Joi.string().optional(),
  category: Joi.string().optional(),
  description: Joi.string().allow('', null).optional(),
  price: Joi.number().precision(2).optional(),
  stock_quantity: Joi.number().integer().optional(),
  compatibility: Joi.string().allow('', null).optional(),
  status: Joi.string().valid('Available','Out of Stock','Discontinued').optional()
});

exports.updateStock = Joi.object({
  delta: Joi.number().required()
});
