import { songPayloadSchema } from "./schema";

export const songValidator = {
    validateSongPayload: (payload) => {
        const { error } = songPayloadSchema.validate(payload);

        if (error) {
            // Exception
        }
    },
};
