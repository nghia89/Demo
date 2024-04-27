'use strict'

const mongoose = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = "Spu"
const COLLECTION_NAME = "Spus"


// Declare the Schema of the Mongo model
const spuSchema = new mongoose.Schema({
    product_id: { type: String, default: '' },
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: { type: String },
    product_category: { type: Array, required: [] },
    product_slug: { type: String },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: { type: mongoose.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: mongoose.Schema.Types.Mixed, required: true },
    /* {
            attribute_id:123.// style [quan chau, thoi trang, mua he]
            attribute_values:[{value_id:123}]
        }
    */
    product_ratingsAverage: {
        type: Number, default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: { type: Array, default: [] },
    /*
    {
        tier_varation:[
            {
                images:[],
                name:'color',
                options:['red',green]
            },
             {
                images:[],
                name:'size',
                options:['m',l]
            },
        ]
    }

    */
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
    isDelete: { type: Boolean, default: false }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

spuSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})

module.exports = mongoose.model(DOCUMENT_NAME, spuSchema)