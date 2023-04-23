'use strict'

const { Types } = require('mongoose')
const keyTokenModel = require('../models/keytoken.model')

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // const tokens = await keyTokenModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })

            const filter = { user: userId }, update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
                options = { upsert: true, new: true }

            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null

        } catch (error) {
            return error
        }
    }

    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
    }

    static removeByKeyId = async (id) => {
        return await keyTokenModel.findByIdAndRemove(id)
    }

    static findByFreshTokenUsed = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean()
    }
    static findByFreshToken = async (refreshToken) => {
        return await keyTokenModel.findOne({ refreshToken: refreshToken }).lean()
    }

    static removeByKeyUserId = async (userId) => {
        return await keyTokenModel.findByIdAndRemove({ user: userId })
    }

    static updateRefreshToken = async (id, newRefreshToken, oblRefreshToken) => {
        const filter = { _id: id }, update = {
            $set: { refreshToken: newRefreshToken },
            $addToSet: { refreshTokensUsed: oblRefreshToken }
        }, options = { upsert: true }
        return await keyTokenModel.updateOne(filter, update, options)
    }

}

module.exports = KeyTokenService