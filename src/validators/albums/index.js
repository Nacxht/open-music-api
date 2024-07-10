import { InvariantError } from "../../exceptions/InvariantError.js";
import { albumPayloadSchema } from "./schema";

export const albumsValidator = {
    validateAlbumPayload: (payload) => {
        const { error } = albumPayloadSchema.validate(payload);

        if (error) {
            throw new InvariantError(error.message);
        }
    },
};
