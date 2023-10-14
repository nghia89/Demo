'use strict';
const amqp = require('amqplib')


async function consumeOrderMessage() {
    const connect = await amqp.connect('amqp://localhost')
    const channel = await connect.createChannel()
    const queueName = 'order-message'

    await channel.assertQueue(queueName, {
        durable: true,
    })

    channel.prefetch(1)
    channel.consume(queueName, msg => {
        const message = msg.content.toString();

        setTimeout(() => {
            console.log('processed message:', message)
            channel.ack(msg)
        }, Math.random() * 1000)
    })
}

consumeOrderMessage().catch(console.error)