import { Response } from "express";
import { HTTP_STATUS } from "./statusHttp";
import { isJsonString } from "./toolkit";


class BadRequest extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "BadRequest";
    }
}

class NotFound extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "NotFound";
    }
}

class InternalServerError extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "InternalServerError";
    }
}

class Unauthorized extends Error {
    constructor(message?: string) {
        super(message);
        this.name = "Unauthorized";
    }
}

export default {
    BadRequest,
    InternalServerError,
    NotFound,
    Unauthorized
};

export function handleError(e: any, res: Response) {

    if(isJsonString(e.message)) {
        e.message = JSON.parse(e.message);
    }

    if (e instanceof NotFound) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message: e.message, status: HTTP_STATUS.NOT_FOUND});
    } else if (e instanceof BadRequest) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: e.message, status: HTTP_STATUS.BAD_REQUEST});
    } else if (e instanceof Unauthorized) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: e.message, status: HTTP_STATUS.UNAUTHORIZED});
    } else {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Something went wrong :/" });
    }

}