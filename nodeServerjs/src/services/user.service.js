'use strict'
const USER = require('./../models/user.model')
const { ErrorResponse } = require('./../core/success.response');
const { sendEmailToken } = require('./email.service');

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

module.exports = { newUserService }