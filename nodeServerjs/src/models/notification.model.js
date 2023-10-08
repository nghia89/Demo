'use strict'

const { model, Types, Schema } = require('mongoose')

const DOCUMENT_NAME = "Notification"
const COLLECTION_NAME = "Notifications"

const notificationSchema = new Schema({
    noti_type: { type: String, enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'], require: true },
    noti_senderId: { type: Types.ObjectId, require: true, ref: 'Shop' },
    noti_receivedId: { type: Number, require: true },
    noti_content: { type: String, require: true },
    noti_options: { type: Object, require: false, default: {} },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = {
    NOTI: model(DOCUMENT_NAME, notificationSchema)
}