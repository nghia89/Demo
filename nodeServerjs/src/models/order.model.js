'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'Orders'

const orderSchema = new Schema({
    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    //     Order_checkout=
    //        {
    //          totalPrice,
    //          totalApplyDiscount,
    //          feeShip
    //          }

    order_shipping: { type: Object, default: {} },
    //street,
    //city,
    //state,
    //country

    order_payment: { type: Object, default: {} },
    order_products: { type: Array, required: true },
    order_trackingNumber: { type: String, default: '#000011052022' },
    order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending' }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = {
    order: model(DOCUMENT_NAME, orderSchema)
}