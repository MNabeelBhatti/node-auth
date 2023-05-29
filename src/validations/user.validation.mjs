import Joi from "joi";

export const createUser = Joi.object({
  email: Joi.string().email().required().invalid("admin@gmail.com"),
  password: Joi.string().required(),
  name: Joi.string().allow(null),
  //gender should be enum
  gender: Joi.string().valid("Male", "Female", "Other").default("Male"),
  cahngePassword: Joi.boolean().default(false),
});

export const updateUser = Joi.object({
  email: Joi.string().email().invalid("admin@gmail.com"),
  password: Joi.string(),
  name: Joi.string().allow(null),
  //gender should be enum
  gender: Joi.string().valid("Male", "Female", "Other").allow(null),
});
