import Joi from "joi";

export const albumPayloadSchema = Joi.object({
    name: Joi.string().required(),
    year: Joi.number(),
});
