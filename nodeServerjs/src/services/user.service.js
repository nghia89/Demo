'use strict'
const USER = require('./../models/user.model')
const { ErrorResponse } = require('./../core/success.response')
const newUser = async ({
    email = null,
    captcha = null
}) => {
    const user = await USER.findOne({ email }).lean();

    if (user) {
        return ErrorResponse({ message: 'Email already exists' })
    }
    return user;
}

module.exports = { newUser }