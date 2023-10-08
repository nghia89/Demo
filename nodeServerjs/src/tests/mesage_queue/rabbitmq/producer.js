const amqp = require('amqplib')
const messages = 'hello'

const runProducer = async () => {
    try {
        const connect = await amqp.connect('amqp://localhost')
        const channel = await connect.createChannel()

        const queueName = "test-topic"
        await channel.assertQueue(queueName, {
            durable: true
        })

        channel.sendToQueue(queueName, Buffer.from(messages))
        console.log(messages)
    } catch (error) {
        console.log(error)
    }
}

runProducer().catch(console.error)