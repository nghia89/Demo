const amqp = require('amqplib')
const messages = 'hello'

const log = console.log;
console.log = function () {
    log.apply(console, [new Date()].concat(arguments));
}
const runProducer = async () => {
    try {
        const connect = await amqp.connect('amqp://localhost')
        const channel = await connect.createChannel()

        const notificationExchange = 'notificationEx'
        const notiQueue = 'notificationQueueProcess'
        const notificationExchangeDLX = 'notificationExDLX'
        const notificationRoutingKeyXML = 'notificationRoutingKeyDLX'

        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        })
        //1. create Exchange
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false,// cho phep cac ket noi vao cung mot luc hang doi
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyXML
        })
        //2. bindQueue
        await channel.bindQueue(queueResult.queue, notificationExchange, notificationRoutingKeyXML)

        //3 Send message
        const msg = 'a new message'
        console.log('producer msg::', msg)
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000'
        })

        setTimeout(() => {
            connect.close();
            process.exit(0);
        }, 500)

    } catch (error) {
        console.log(error)
    }
}

runProducer().catch(console.error)