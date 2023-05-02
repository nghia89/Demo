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
        throw new AuthFailureError('Invalid Request')

    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Header is not define')

    const refreshToken = req.headers[HEADER.REFRESHTOKEN]
    if (refreshToken) {
        try {
            console.log('decodeToken 2', refreshToken)
            const decodeToken = JWT.verify(refreshToken, keyStore.privateKey)
            console.log('decodeToken', decodeToken)
            if (userId !== decodeToken.userId)
                throw new AuthFailureError('invalid UserId')

            req.keyStore = keyStore
            req.user = decodeToken
            req.refreshToken = refreshToken
            return next()
        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Header is not define')

    try {
        console.log('accessToken', accessToken)
        const decodeToken = await JWT.verify(accessToken, keyStore.publicKey)

        if (userId !== decodeToken.userId)
            throw new AuthFailureError('invalid UserId')
        req.keyStore = keyStore
        req.user = decodeToken
        return next()
    } catch (error) {
        return res.status(403).json({
            message: 'Forbidden'
        })
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