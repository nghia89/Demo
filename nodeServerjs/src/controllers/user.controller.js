'use strict'
const { newUserService } = require('./../services/user.service')
const { OK } = require('./../core/success.response')
class UserController {
    newUser = async (req, res, next) => {
        new OK({
            message: 'new user success',
            metadata: await newUserService({ email: req.body.email })
        }).send(res)
    }

    checkRegisterEmailToken = async () => {

    }

}

module.exports = new UserController()