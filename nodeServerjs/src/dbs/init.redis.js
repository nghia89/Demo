'use strict'

const { createClient } = require('redis')
const { RedisErrorResponse } = require('./../core/success.response')
let client = {}, statusConnectRedis = {
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
        console.log(`connectionRedis - connection status: connected`)
        clearTimeout(connectionTimeout)
    })

    connectionRedis.on(statusConnectRedis.END, () => {
        console.log(`connectionRedis - connection status: disconnected`)
        handleTimeOutError()
    })

    connectionRedis.on(statusConnectRedis.RECONNECT, () => {
        console.log(`connectionRedis - connection status: reconnecting`)
        clearTimeout(connectionTimeout)
    })

    connectionRedis.on(statusConnectRedis.ERROR, (err) => {
        console.log(`connectionRedis - connection status: error ${err}`)
        handleTimeOutError()
    })

}

const initRedis = () => {
    const instanceRedis = createClient({
        host: "localhost",
        port: 6379
    });
    client.instanceConnect = instanceRedis
    handleEventConnection({
        connectionRedis: instanceRedis
    })
}

const getRedis = () => client

const closeRedis = () => {

}


module.exports = {
    initRedis,
    getRedis,
    closeRedis
}