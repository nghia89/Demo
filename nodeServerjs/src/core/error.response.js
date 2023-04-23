'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    CONFLICT: 409
}

const ReasonStatusCode = {
    FORBIDDEN: 'Bad request error',
    CONFLICT: "Conflict error"
}
class ErrorResponse extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}
class BadRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}


class ConflictRequestError extends ErrorResponse {
    constructor(message = ReasonStatusCode.CONFLICT, statusCode = StatusCode.FORBIDDEN) {
        super(message, statusCode)
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = "UnAuthorized", statusCode = 401) {
        super(message, statusCode)
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = "NotFound", statusCode = 404) {
        super(message, statusCode)
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message = "Forbidden", statusCode = 403) {
        super(message, statusCode)
    }
}

module.exports = {
    BadRequestError,
    ConflictRequestError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError
}