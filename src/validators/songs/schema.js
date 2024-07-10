import Joi from "joi";

export const songPayloadSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.string().required(),
    genre: Joi.string().required(),
    performer: Joi.string().required(),
    duration: Joi.number(),
    albumId: Joi.string(),
});
