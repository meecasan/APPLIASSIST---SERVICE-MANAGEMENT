const Joi = require('joi');

exports.registerCustomer = Joi.object({
  first_name: Joi.string().min(1).required(),
  middle_name: Joi.string().allow('', null).optional(),
  last_name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  contact_number: Joi.string().min(1).required(),
  address: Joi.string().min(1).required()
});

exports.registerTechnician = Joi.object({
  first_name: Joi.string().min(1).required(),
  middle_name: Joi.string().allow('', null).optional(),
  last_name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  contact_number: Joi.string().min(1).required(),
  specialization: Joi.string().min(1).required(),
  service_area: Joi.string().allow('', null).optional()
});

exports.registerStoreOwner = Joi.object({
  first_name: Joi.string().min(1).required(),
  middle_name: Joi.string().allow('', null).optional(),
  last_name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  contact_number: Joi.string().min(1).required(),
  address: Joi.string().min(1).required()
});

exports.login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required()
});
