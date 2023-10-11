'use strict'

const amqp = require('amqplib')

const connectToRabbitMQ = async () => {
    try {
        const connect = await amqp.connect('amqp://localhost')
        if (!connect) throw new Error('amqp not connection')
        const channel = await connect.createChannel()
        return { channel, connect }
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

const consumerQueue = async (channel, queueName) => {
    try {
        await channel.assertQueue(queueName, { durable: true })
        console.log('Waiting for messages...');
        channel.consume(queueName, msg => {
            console.log(`Received message: ${queueName}`, msg.content.toString())
        }, {
            noAck: true
        })
    } catch (error) {
        console.error('error pushing consumer queue', error)
        throw new Error
    }
}


module.exports = {
    connectToRabbitMQ,
    connectToRabbitMQForTesting,
    consumerQueue
}