'use strict'

const { OK, CREATED } = require("../core/success.response")
const AccessService = require("../services/access.service")


class AccessController {
    logIn = async (req, res, next) => {
        new OK({
            message: 'LogIn Ok!',
            metadata: await AccessService.logIn(req.body)
        }).send(res)
    }
    signUp = async (req, res, next) => {
        new CREATED({
            metadata: await AccessService.signUp(req.body)
        }).send(res)
    }
    logOut = async (req, res, next) => {
        new OK({
            message: 'LogOut Ok!',
            metadata: await AccessService.logOut(req.keyStore)
        }).send(res)
    }
    handlerRefreshToken = async (req, res, next) => {
        new OK({
            message: 'Get Token Ok!',
            metadata: await AccessService.handlerRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }
}

module.exports = new AccessController()