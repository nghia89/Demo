'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = "Carts"
// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    cart_state: {
        type: String, require: true,
        enum: ['active', 'complete', 'failed', 'pending']
    },
    cart_products: {
        type: Array, require: true, default: []
    },
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, require: true }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, cartSchema);