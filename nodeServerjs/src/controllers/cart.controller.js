'use strict'

const { OK } = require("../core/success.response")
const CartService = require("../services/cart.service")

class CartController {


    addToCart = async (req, res, next) => {
        new OK({
            message: 'Create new cart success',
            metadata: await CartService.addCart(req.body)
        }).send(res)
    }

    updateCart = async (req, res, next) => {
        new OK({
            message: 'Update cart success',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }

    delete = async (req, res, next) => {
        new OK({
            message: 'Delete cart success',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }

    listToCart = async (req, res, next) => {
        new OK({
            message: 'Get list cart success',
            metadata: await CartService.getListUserCart(req.query)
        }).send(res)
    }
}

module.exports = new CartController()