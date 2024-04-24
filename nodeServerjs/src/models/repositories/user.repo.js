'use strict'

const USER = require('../user.model')


const createUser = async ({
    usr_id,
    usr_slug,
    usr_name,
    usr_password,
    usr_role
}) => {
    return await USER.create({
        usr_id,
        usr_slug,
        usr_email: usr_name,
        usr_name,
        usr_password,
        usr_role
    })
}

module.exports = { createUser }