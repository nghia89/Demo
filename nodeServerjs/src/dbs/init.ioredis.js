'use strict'

const Redis = require('ioredis')
const { RedisErrorResponse } = require('../core/success.response')
let clients = {}, statusConnectRedis = {
    CONNECT: 'connect',
    END: 'end',
    RECONNECT: 'reconnecting',
    ERROR: 'error'
}
const handleTimeOutError = () => {
    connectionTimeout = setTimeout(() => {
        throw new RedisErrorResponse({
            message: 'Redis connection error',
            statusCode: 500
        })
    }, 10000);
}

const handleEventConnection = ({
    connectionRedis
}) => {
    connectionRedis.on(statusConnectRedis.CONNECT, () => {
        console.log(`connectionIORedis - connection status: connected`)
        // clearTimeout(connectionTimeout)
    })

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`connectionIORedis - connection status: disconnected`)
        handleTimeOutError()
    })

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`connectionIORedis - connection status: reconnecting`)
        clearTimeout(connectionTimeout)
    })

    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log(`connectionIORedis - connection status: error ${err}`)
        handleTimeOutError()
    })

}

const initRedis = ({
    IOREDIS_IS_ENABLED,
    IOREDIS_HOTS = process.env.REDIS_CACHE_HOST,
    IOREDIS_PORT = 6379
}) => {
    if (IOREDIS_IS_ENABLED) {
        const instanceRedis = new Redis({
            host: IOREDIS_HOTS,
            port: IOREDIS_PORT
        })
        clients.instanceConnect = instanceRedis
        handleEventConnection({
            connectionRedis: instanceRedis
        })
    }
}

const getIORedis = () => clients

const closeIORedis = () => {

}


module.exports = {
    initRedis,
    getIORedis,
    closeIORedis
}