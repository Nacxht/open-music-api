import { ClientError } from "./ClientError";

export class InvariantError extends ClientError {
    constructor(message) {
        super(message);
        this.name = "InvariantError";
    }
}
