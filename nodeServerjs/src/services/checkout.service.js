'use strict'
const { findCartById } = require('./../models/repositories/cart.repo')
const { BadRequestError } = require('./../core/error.response')
const { checkProductByServer } = require('./../models/repositories/product.repo')
const { getDiscountAmount } = require('./../services/discount.service')
const { reservationInventory } = require('../models/repositories/inventory.repo')
const { acquireLock, releaseLock } = require('./redis.service')
const { order } = require('./../models/order.model')
class CheckoutService {

    static async checkoutReview({ cartId, userId, shop_order_ids }) {
        // check cartId ton tai kh
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new BadRequestError('Cart does not exists!')

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }, shop_order_ids_new = []

        // tinh tong tien bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            console.log('shop_order_ids[i]', shop_order_ids, i, shop_order_ids.length)
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]
            //check product available

            const checkProductServer = await checkProductByServer(item_products)
            console.log('checkProductByServer::', checkProductByServer)

            // tong tien don hang

            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc += (product.quantity * product.price)
            }, 0)

            // tong tien truoc khi xu ly
            checkout_order.totalPrice = + checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // shop_discounts ton tai >0, check xem co hop le hay khong
            if (shop_discounts.length > 0) {
                // gia su chi co mot discount
                //get amount discount
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })

                // tong cong discount giam gia
                checkout_order.totalDiscount += discount

                // neu tien giam gia lon hon 0
                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            // tong thanh toan cuoi cung 
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }


    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {},

    }) {
        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids
        })

        // check lai mot lan nua xem vuot ton kho hay khong?
        // get new array Products
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        const acquireProduct = []
        for (let i = 0; i < products; i++) {
            const { productId, quantity } = products[i]
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireLock.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        // neu co mot san pham het hang trong kho
        if (acquireProduct.includes(false)) {
            throw new BadRequestError('Mot san pham da duoc cap nhat, vui long quay lai go hang...')
        }

        const newOder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })
        // truong hop: new insert thanh cong, thi remove product co trong cart
        if (newOrder) {
            // remove product in my cart
        }
        return newOrder
    }

    static async getOrdersByUser() { }
    static async getOneOrdersByUser() { }
    static async cancelOrderByUser() { }
    static async updateOrderStatusByShop() { }


}
module.exports = CheckoutService