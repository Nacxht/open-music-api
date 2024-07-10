import { InvariantError } from "../../exceptions/InvariantError";
import { albumPayloadSchema } from "./schema";

export const albumValidator = {
    validateAlbumPayload: (payload) => {
        const { error } = albumPayloadSchema.validate(payload);

        if (error) {
            throw new InvariantError(error.message);
        }
    },
};
