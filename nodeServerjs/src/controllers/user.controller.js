'use strict'
const { newUserService, checkLoginEmailTokenService } = require('./../services/user.service')
const { OK } = require('./../core/success.response')
class UserController {
    newUser = async (req, res, next) => {
        new OK({
            message: 'new user success',
            metadata: await newUserService({ email: req.body.email })
        }).send(res)
    }

    checkRegisterEmailToken = async (req, res, next) => {
        new OK({
            message: 'LogIn Ok!',
            metadata: await checkLoginEmailTokenService({ token: req.query.token })
        }).send(res)
    }

}

module.exports = new UserController()