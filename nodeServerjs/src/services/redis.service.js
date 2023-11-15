'use strict'

const redis = require('redis')
const { promisify } = require('util')
const { reservationInventory } = require('../models/repositories/inventory.repo')
const redisClient = redis.createClient({ url: 'redis://default:OjrUH8ccHByADlkMkBaVK0uLg0lQmugg@redis-11156.c295.ap-southeast-1-1.ec2.cloud.redislabs.com:11156' })

const pexpire = promisify(redisClient.pExpire).bind(redisClient)
const setnxAsync = promisify(redisClient.setEx).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`
    const retryTimes = 10
    const expireTime = 3000
    console.log('result:::', retryTimes.length)
    for (let i = 0; i < retryTimes; i++) {
        const result = await setnxAsync(key, expireTime)
        console.log('result:::', result)
        if (result === 1) {
            //thao tac vs inventory
            const isReversation = await reservationInventory({
                productId, quantity, cartId
            })

            if (isReversation.modifiedCount) {
                await pexpire(key, expireTime)
                return key
            }
            return null;
        }
        else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}