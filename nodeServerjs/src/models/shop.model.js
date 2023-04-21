'use strict'


//!dmbg
const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'shop'
const COLLECTION_NAME = 'shops'
// Declare the Schema of the Mongo model
var shopSchema = new Schema({
    name: {
        type: String,
        trim: true,
        maxLength: 150
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    verfify: {
        type: Schema.Types.Boolean,
        default: false
    },
    roles: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collation: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);