'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Sku"
const COLLECTION_NAME = "Skus"

const skuSchema = new mongoose.Schema({
    sku_id: { type: String, required: true, index: true, select: false },
    sku_tier_idx: { type: Array, default: [0] },
    /*
        color:[red,green]=[0,1]
        size:[s,m]=[1,1]
        =>red + s =[0,1]
    */
    sku_default: { type: Boolean, default: false },
    sku_slug: { type: String, default: '' },
    sku_sort: { type: Number, default: 0 },
    sku_price: { type: String, required: true },
    sku_stock: { type: Number, default: 0 },//ref in of stock
    product_id: { type: String, required: true },// ref to spu product

    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublish: { type: Boolean, default: false, index: true, select: false },
    isDelete: { type: Boolean, default: false },

}, {
    collection: COLLECTION_NAME,
    timestamps: true
})


module.exports = mongoose.model(DOCUMENT_NAME, skuSchema)