// joi validation schema used in conjunction with Celebrate to validate a POST request body (/reservations endpoint).

const { Joi } = require("celebrate");

const schema = Joi.object({
  partySize: Joi.number().min(1).max(100).required(),
  date: Joi.date().min("now").required(),
  restaurantName: Joi.string().required(),
});

module.exports = schema;
