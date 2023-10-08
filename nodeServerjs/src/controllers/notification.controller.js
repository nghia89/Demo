'use strict'

const { OK, CREATED } = require("../core/success.response")
const NotificationService = require("../services/notification.service")


class NotificationController {
    listNotiByUser = async (req, res, next) => {
        new OK({
            message: 'Get Notification Ok',
            metadata: await NotificationService.listNotiByUser(req.query)
        }).send(res)
    }
}

module.exports = new NotificationController()