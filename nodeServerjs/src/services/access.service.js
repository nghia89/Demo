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

    static handlerRefreshToken = async ({ refreshToken, user, keyStore }) => {
        const { userId, email } = user;
        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await KeyTokenService.removeByKeyUserId(userId)
            throw new ForbiddenError('Something wrong happened, please login')
        }
        if (keyStore.refreshToken != refreshToken)
            throw new AuthFailureError('Shop not registerted')

        console.log('aaa', user)
        const foundShop = await findByEmail({ email })
        if (!foundShop) throw new AuthFailureError('Shop Not register 2')
        const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)

        await KeyTokenService.updateRefreshToken(keyStore._id, tokens.refreshToken, refreshToken)

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
            //created token pair
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id,
                privateKey,
                publicKey,
                refreshToken: tokens.refreshToken,
            })

            if (!keyStore) {
                return {
                    code: 'xxx',
                    message: 'keyStore error'
                }
            }


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