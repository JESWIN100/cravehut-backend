import Joi from 'joi'

export const restaurantValidation = (data) => {
const restaurantSchema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    contactNumber: Joi.string().required(),
    cuisineType: Joi.string().required(),
    ratings: Joi.number().min(0).max(5).default(0),
    reviews: Joi.array().items(Joi.string()).default([]),
    
    deliveryAvailable: Joi.boolean().default(false),
    category:Joi.string().required(),
    offers:Joi.string().required(),
    image: Joi.string(),
    owner:Joi.string(),
})
return restaurantSchema.validate(data, { abortEarly: false });
};
