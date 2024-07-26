import Joi from 'joi'

export const collaborationPayloadSchema = Joi.object({
  playlistId: Joi.string(),
  userId: Joi.string()
})
