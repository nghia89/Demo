const redisPubsubService = require('../services/redis.pubsub.service')

class ProductServices {
    purchaseProduct(productId, quantity) {
        const order = {
            productId, quantity
        }
        console.log('order', order)
        redisPubsubService.publish('purchase_events', JSON.stringify(order))
    }
}

module.exports = new ProductServices()