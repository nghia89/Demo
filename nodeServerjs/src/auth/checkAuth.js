'use strict'

const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')
const { findById } = require('./../services/apikey.service')
const JWT = require('jsonwebtoken')
const { HEADER } = require('./../utils/constants')
const asyncHandler = require('./../helpers/asyncHandler')



const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        // check objKey

        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden error'
            })
        }

        req.objKey = objKey
        return next()
    } catch (error) {
        console.log('error', error)
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'permission denied'
            })
        }

        console.log('permission::', req.objKey.permissions)
        const validPermission = req.objKey.permissions.includes(permission)
        if (!validPermission) {
            return res.status(403).json({
                message: 'permission denied'
            })
        }
        return next()
    }
}


const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId)
        throw new AuthFailureError()

    const keyStore = await findByUserId(userId);
    if (!keyStore) throw new NotFoundError('Header is not define')

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError()

    try {
        const decodeToken = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeToken.userId)
            throw new AuthFailureError()
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

module.exports = {
    apiKey,
    permission,
    authentication,
    verifyJWT
}