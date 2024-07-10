import { songPayloadSchema } from "./schema";
import { InvariantError } from "../../exceptions/InvariantError.js";

export const songsValidator = {
    validateSongPayload: (payload) => {
        const { error } = songPayloadSchema.validate(payload);

        if (error) {
            throw new InvariantError(error.message);
        }
    },
};
