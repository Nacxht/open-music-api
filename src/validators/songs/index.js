import { songPayloadSchema } from "./schema";
import { InvariantError } from "../../exceptions/InvariantError";

export const songValidator = {
    validateSongPayload: (payload) => {
        const { error } = songPayloadSchema.validate(payload);

        if (error) {
            throw new InvariantError(error.message);
        }
    },
};
