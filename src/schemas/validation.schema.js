const Joi = require('joi');

const joiRegularStr = Joi.string().trim().required().min(1);
const joiMaxStr = joiRegularStr.max(50);

const userIdParamSchema = Joi.object({
  userId: Joi.number().min(1),
});

const mentorIdParamSchema = Joi.object({
  mentorId: Joi.number().min(1),
});

const sessionIdParamSchema = Joi.object({
  sessionId: Joi.number().min(1),
});

const signupSchema = Joi.object({
  firstName: joiMaxStr,
  lastName: joiMaxStr,
  password: Joi.string().trim().required().min(4),
  email: Joi.string().email(),
  address: Joi.string().trim().required().max(200).min(1),
  bio: Joi.string().trim().required().min(5),
  occupation: joiMaxStr,
  expertise: Joi.string().trim().required().max(100).min(1),
});

const loginSchema = Joi.object({
  email: Joi.string().email(),
  password: joiMaxStr,
});

const createSessionSchema = Joi.object({
  mentorId: Joi.number().min(1).required(),
  questions: joiRegularStr,
});

const reviewSessionSchema = Joi.object({
  score: Joi.number().min(1).required().max(5),
  remark: joiRegularStr,
});

module.exports = {
  createSessionSchema,
  loginSchema,
  signupSchema,
  mentorIdParamSchema,
  userIdParamSchema,
  sessionIdParamSchema,
  reviewSessionSchema,
};
