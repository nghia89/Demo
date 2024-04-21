'use strict'

const StatusCode = {
    CREATED: 201,
    OK: 200,
    INTERNAL_SERVER: 500
}
const ReasonStatusCode = {
    CREATED: 'Created',
    OK: 'Success',
    INTERNAL_SERVER: 'INTERNAL_SERVER'
}

class SuccessResponse {
    constructor({ message, statusCode = StatusCode.OK, reasonStatusCode = ReasonStatusCode.OK, metadata = {} }) {
        this.message = !message ? reasonStatusCode : message
        this.status = statusCode
        this.metadata = metadata
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this)
    }
}


class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata })
    }
}

class CREATED extends SuccessResponse {
    constructor({ message, statusCode = StatusCode.CREATED, reasonStatusCode = ReasonStatusCode.CREATED, metadata }) {
        super({ message, statusCode, reasonStatusCode, metadata })
    }
}

class RedisErrorResponse extends SuccessResponse {
    constructor({ message, statusCode = StatusCode.INTERNAL_SERVER, reasonStatusCode = ReasonStatusCode.INTERNAL_SERVER, metadata }) {
        super({ message, statusCode, reasonStatusCode, metadata })
    }
}

module.exports = {
    OK, CREATED, RedisErrorResponse
}