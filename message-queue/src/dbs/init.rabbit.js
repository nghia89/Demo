'use strict'

const amqp = require('amqplib')

const connectToRabbitMQ = async () => {
    try {
        const connect = amqp.connect('amqp://localhost')
        if (!connect) throw new Error('amqp not connection')
        const channel = await connect.createChannel()
        return (channel, connection)
    } catch (error) {

    }
}

const connectToRabbitMQForTesting = async () => {
    try {
        const { channel, connect } = await connectToRabbitMQ()

        const queue = 'testQueue'
        const message = 'Hello from RabbitMQ'
        await channel.assertQueue(queue)
        await channel.sendToQueue(queue, Buffer.from(message))
    } catch (error) {

    }
}


module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTesting
}