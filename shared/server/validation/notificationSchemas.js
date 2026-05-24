const Joi = require('joi');

exports.createNotification = Joi.object({
  recipient_type: Joi.string().valid('Customer','Technician','Store Owner').required(),
  recipient_id: Joi.number().integer().required(),
  notification_type: Joi.string().valid('Order Update','Service Update','Registration Update','Appointment Reminder','General').required(),
  message: Joi.string().min(1).required()
});
