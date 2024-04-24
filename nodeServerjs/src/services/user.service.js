'use strict'
const USER = require('./../models/user.model')
const { ErrorResponse } = require('./../core/success.response');
const { sendEmailToken } = require('./email.service');
const { checkEmailToken } = require('./otp.service');
const bcrypt = require('bcrypt')
const { createTokenPair, getKey } = require("./../auth/authUtils.js");
const KeyTokenService = require("./keyToken.service");
const { createUser } = require('./../models/repositories/user.repo.js');
const { getInfoData } = require('../utils');
const newUserService = async ({
    email = null,
    captcha = null
}) => {
    const user = await USER.findOne({ email }).lean();

    if (user) {
        return ErrorResponse({ message: 'Email already exists' })
    }
    const result = await sendEmailToken({
        email
    })
    return result;
}


const checkLoginEmailTokenService = async ({
    token
}) => {
    try {
        console.log('token', token)
        const { otp_token, otp_email: email } = await checkEmailToken({ token })

        const hasUser = await findUserByEmailWithLogin({ email })
        if (hasUser) throw new ErrorResponse("Email already exists")
        const passwordHash = await bcrypt.hash(email, 10)

        const newUser = await createUser({
            usr_id: 1,
            usr_name: email,
            usr_slug: 'slug',
            usr_password: passwordHash,
            usr_role: '661d3f933c3f3037829419e6'
        })

        if (newUser) {
            const { publicKey, privateKey } = getKey()
            //created token pair
            const tokens = await createTokenPair({ userId: newUser._id, email }, publicKey, privateKey)
            console.log('tokens', tokens)
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newUser._id,
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
                    user: getInfoData({ fields: ['usr_id', 'usr_name', 'usr_email'], object: newUser }),
                    tokens
                }
            }
        }
    } catch (error) {
        console.log(error)
    }

}

const findUserByEmailWithLogin = async ({ email }) => {
    return await USER.findOne({ usr_email: email }).lean(0)
}

module.exports = { newUserService, checkLoginEmailTokenService }