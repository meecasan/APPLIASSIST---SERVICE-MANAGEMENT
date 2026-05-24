const Joi = require('joi');

exports.createService = Joi.object({
  customer_id: Joi.number().integer().optional(),
  store_id: Joi.number().integer().required(),
  appliance_id: Joi.number().integer().required(),
  service_address: Joi.string().min(1).required(),
  problem_description: Joi.string().allow('', null).optional(),
  scheduled_date: Joi.date().optional()
});

exports.assignTechnician = Joi.object({ technician_id: Joi.number().integer().required() });

exports.updateStatus = Joi.object({ status: Joi.string().valid('requested','assigned','in_progress','completed','cancelled').required() });
