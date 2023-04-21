'use strict'

const { model, Schema } = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'key'
const COLLECTION_NAME = 'keys'
// Declare the Schema of the Mongo model
var userSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        trim: true,
    },
    publicKey: {
        type: String,
        required: true,
        trim: true,
    },
    privateKey: {
        type: String,
        required: true,
        trim: true,
    },
    refreshToken: {
        type: String,

    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, userSchema);