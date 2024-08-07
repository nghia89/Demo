'use strict'

const { OK, CREATED } = require("../core/success.response")
const DiscountService = require("../services/discount.service")

class DiscountController {

    createDiscountCode = async (req, res, next) => {
        new OK({
            message: 'Create Discount Ok',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodesByShop = async (req, res, next) => {
        new OK({
            message: 'get all Discount Ok',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.user.userId
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new OK({
            message: 'get all Discount Ok',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }


    getAllDiscountCodesWithProduct = async (req, res, next) => {
        new OK({
            message: 'get all Discount Ok',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query
            })
        }).send(res)
    }

}

module.exports = new DiscountController()