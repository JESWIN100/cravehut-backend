import Joi from "joi";

export const registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).messages({
      "any.only": "Passwords do not match",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};
