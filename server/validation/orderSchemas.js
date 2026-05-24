const Joi = require('joi');

exports.createOrder = Joi.object({
  customer_id: Joi.number().integer().required(),
  store_id: Joi.number().integer().required(),
  items: Joi.array().items(Joi.object({ part_id: Joi.number().integer().required(), quantity: Joi.number().integer().min(1).required(), unit_price: Joi.number().precision(2).required() })).min(1).required()
});

exports.updateStatus = Joi.object({
  status: Joi.string().valid('Pending','Confirmed','Processing','Ready for Pickup','Completed','Cancelled').required()
});
