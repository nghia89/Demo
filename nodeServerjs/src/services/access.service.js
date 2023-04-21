'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require("node:crypto");
const { createTokenPair } = require("./../auth/authUtils.js");
const KeyTokenService = require("./keyToken.service");
const { getInfoData } = require("../utils");

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}


class AccessService {

    static signUp = async ({ name, email, password }) => {
        try {
            // step1 : check email exists
            const holderShop = await shopModel.findOne({ email })
            if (holderShop) {
                return {
                    code: 'xxx',
                    message: "Shop already registered"
                }
            }
            const passwordHash = await bcrypt.hash(password, 10)
            console.log('passwordHash', passwordHash)
            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            if (newShop) {
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                // })

                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

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
                //const publicKeyObject = crypto.createPublicKey(publicKeyString)
                //created token pair
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
                console.log('Created Token Success::'.tokens)

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                    }
                }
            }


        } catch (error) {
            console.log('error', error)
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }

}

module.exports = AccessService