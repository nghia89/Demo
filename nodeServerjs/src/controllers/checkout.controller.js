'use strict'

const { OK } = require("../core/success.response")
const CheckService = require("../services/checkout.service")

class CheckOutController {

    checkoutReview = async (req, res, next) => {
        new OK({
            message: 'Create new checkout success',
            metadata: await CheckService.checkoutReview(req.body)
        }).send(res)
    }


}

module.exports = new CheckOutController()