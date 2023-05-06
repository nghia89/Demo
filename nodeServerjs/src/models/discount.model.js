'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required


const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = "Discounts"

// Declare the Schema of the Mongo model
var discountSchema = new Schema({
    discount_name: { type: String, require: true },
    discount_description: { type: String, require: true },
    discount_type: { type: String, default: 'fixed_amount' },
    discount_value: { type: Number, require: true },
    discount_code: { type: String, require: true },
    discount_start_date: { type: Date, require: true },
    discount_end_date: { type: Date, require: true },
    discount_max_uses: { type: Number, require: true },// sl discount da ap dung
    discount_uses_count: { type: Number, require: true },//sl discount da su dung
    discount_users_used: { type: Array, default: [] },//ai dang dung
    discount_max_uses_per_user: { type: Number, require: true },// sl cho phep toi da
    discount_min_order_value: { type: Number, require: true },
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },

    discount_is_active: { type: Boolean, default: true },
    discount_applies_to: { type: String, require: true, enum: ['all', 'specific'] },
    discount_product_ids: { type: Array, default: [] }
}, {
    timestamps: true,
    collation: COLLECTION_NAME
});

//Export the model
module.exports = {
    discount: model(DOCUMENT_NAME, discountSchema)
};