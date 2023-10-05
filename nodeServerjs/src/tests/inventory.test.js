const redisPubsubService = require('../services/redis.pubsub.service')


class InventoryService {
    constructor() {
        redisPubsubService.subscribe('purchase_events', (channel, message) => {
            InventoryService.updateInventory(message)
        })
    }

    static updateInventory(productId, quantity) {
        console.log(`Update inventory ${productId} with ${quantity}`)
    }
}

module.exports = new InventoryService();