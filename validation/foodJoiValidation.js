import Joi from "joi";

export const foodValidation = (data) => {
    const foodSchema = Joi.object({
        name: Joi.string().min(2).max(100).required(),
        price: Joi.number().positive().required(),
        description: Joi.string().min(5).max(500).required(),
        category: Joi.string().min(3).max(50).required(),
        rating: Joi.number().min(0).max(5).optional(),
        discount:Joi.number().min(0).max(100).optional(),
        ingredients: Joi.string().min(5).max(500).optional(),
        availability: Joi.string().optional(),
        restaurant: Joi.string().required(),
        image: Joi.string(),
    });

    return foodSchema.validate(data, { abortEarly: false });
};
