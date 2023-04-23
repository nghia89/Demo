'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require("node:crypto");
const { createTokenPair, getKey } = require("./../auth/authUtils.js");
const KeyTokenService = require("./keyToken.service");
const { getInfoData } = require("../utils");
const { BadRequestError, ConflictRequestError, AuthFailureError, ForbiddenError } = require('../core/error.response');
const { findByEmail } = require("./shop.service");
const { verifyJWT } = require("../auth/checkAuth");
const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}


class AccessService {

    static handlerRefreshToken = async (refreshToken) => {
        console.log('refreshToken', refreshToken)
        var foundToken = await KeyTokenService.findByFreshTokenUsed(refreshToken)
        if (foundToken) {
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)
            await KeyTokenService.removeByKeyUserId(userId)
            throw new ForbiddenError()
        }

        const holderToken = await KeyTokenService.findByFreshToken(refreshToken)
        if (!holderToken) throw new AuthFailureError('Shop Not register 1')

        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log('2---', userId, email)

        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('Shop Not register 2')
        const tokens = await createTokenPair({ userId, email }, holderToken.publicKey, holderToken.privateKey)

        await KeyTokenService.updateRefreshToken(holderToken._id, tokens.refreshToken, refreshToken)

        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        }
    }

    static logOut = async (keyStore) => {
        return await KeyTokenService.removeByKeyId(keyStore._id)
    }

    static logIn = async ({ email, password, refreshToken = null }) => {
        const shop = await findByEmail({ email });
        if (!shop) throw new BadRequestError('Shop not register')

        const match = await bcrypt.compare(password, shop.password)
        if (!match) throw new AuthFailureError()

        const { publicKey, privateKey } = getKey()
        const tokens = await createTokenPair({ userId: shop._id, email }, publicKey, privateKey)

        await KeyTokenService.createKeyToken(
            {
                userId: shop._id,
                refreshToken: tokens.refreshToken,
                privateKey, publicKey
            }
        )

        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: shop }),
            tokens
        }
    }

    static signUp = async ({ name, email, password }) => {
        // step1 : check email exists
        const holderShop = await shopModel.findOne({ email })
        if (holderShop) {
            throw new BadRequestError('Error: Shop already registered')
        }
        const passwordHash = await bcrypt.hash(password, 10)
        console.log('passwordHash', passwordHash)
        const newShop = await shopModel.create({
            name, email, password: passwordHash, roles: [RoleShop.SHOP]
        })

        if (newShop) {
            const { publicKey, privateKey } = getKey()
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                privateKey,
                publicKey
            })

            if (!keyStore) {
                return {
                    code: 'xxx',
                    message: 'keyStore error'
                }
            }

            //created token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            console.log('Created Token Success::', tokens)
            return {
                metadata: {
                    shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                    tokens
                }
            }
        }
    }

}

module.exports = AccessService