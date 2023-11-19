'use strict';
const amqp = require('amqplib')

async function consumeOrderMessage() {
    const connect = await amqp.connect('amqp://yuqgbuwk:jDZ0Lz3tKCqVtSrlnY-fhbLrCEWggsp-@armadillo.rmq.cloudamqp.com:5672/yuqgbuwk')
    const channel = await connect.createChannel()
    const queueName = 'order-message'

    await channel.assertQueue(queueName, {
        durable: true
    })

    for (let index = 0; index < 10; index++) {
        const message = `${queueName} ${index}`
        console.log(`message: ${message}`)
        channel.sendToQueue(queueName, Buffer.from(message), {
            persistent: true
        })
    }
    setTimeout(() => {
        connect.close()
    }, 1000);
}

consumeOrderMessage().catch(console.error)