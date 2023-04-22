'use strict'

const { asyncHandler } = require("../auth/checkAuth")
const { CREATED } = require("../core/success.response")
const AccessService = require("../services/access.service")


class AccessController {
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registered Ok!',
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }
}

module.exports = new AccessController()