const Joi = require('joi');

exports.createStore = Joi.object({
  store_owner_id: Joi.number().integer().optional(),
  store_name: Joi.string().required(),
  store_type: Joi.string().valid('With Repair Services','Parts Only').optional(),
  store_address: Joi.string().min(1).required()
});

exports.updateStore = Joi.object({
  store_name: Joi.string().optional(),
  store_type: Joi.string().valid('With Repair Services','Parts Only').optional(),
  store_address: Joi.string().allow('', null).optional()
});
