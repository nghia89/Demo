'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')


const countConnect = () => {
    const numberConnection = mongoose.connections.length
    console.log(`Number of connections::${numberConnection}`)
}

const checkOverload = () => {
    const numberConnection = mongoose.connections.length
    const numberCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss;
    const maxConnect = numberCores * 5

    console.log(`memory usage:: ${memoryUsage / 1024 / 1024} MB`)
    if (numberConnection > maxConnect)
        console.log(`Connection overload detected`)
    // setInterval(() => {
    //     console.log(`memory usage:: ${memoryUsage / 1024 / 1024} MB`)
    //     if (numberConnection > maxConnect)
    //         console.log(`Connection overload detected`)
    // }, 5000);

}
module.exports = {
    countConnect,
    checkOverload
}