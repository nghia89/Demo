'use strict'

const { OK, CREATED } = require("../core/success.response")

const profiles = [{
    usr_id: 1,
    usr_name: 'cr7',
    usr_avt: 'image'
}, {
    usr_id: 2,
    usr_name: 'm10',
    usr_avt: 'image'
}, {
    usr_id: 3,
    usr_name: 'n7',
    usr_avt: 'image'
}]
class ProfileController {
    //admin
    profiles = async (req, res, next) => {
        new OK({
            message: 'Create Product Ok',
            metadata: profiles
        }).send(res)
    }

    //shop
    profile = async (req, res, next) => {
        new OK({
            message: 'Create Product Ok',
            metadata: {
                usr_id: 2,
                usr_name: 'm10',
                usr_avt: 'image'
            }
        }).send(res)
    }
}

module.exports = new ProfileController()