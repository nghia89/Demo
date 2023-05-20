'use strict'
const { stringToObjectId } = require('../../utils')
const cart = require('../cart.model')


const findCartById = async (cartId) => {
    return await cart.findOne({ _id: stringToObjectId(cartId), cart_state: 'active' }).lean()
}

module.exports = { findCartById }