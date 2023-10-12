'use strict';

const {
    consumerQueue,
    connectToRabbitMQ
} = require('../dbs/init.rabbit')
// const log = console.log;
// console.log = function () {
//     log.apply(console, [new Date()].concat(arguments));
// }

const messagesService = {
    consumerToQueue: async (queueName) => {
        try {
            const { channel, connect } = await connectToRabbitMQ()
            await consumerQueue(channel, queueName);
        } catch (e) {
            console.error('Error consumerToRabbit', e);
        }
    },
    consumerToQueueNormal: async (queueName) => {
        try {
            const { channel, connect } = await connectToRabbitMQ()
            const notiQueue = 'notificationQueueProcess'

            //1. case timeout
            // setTimeout(() => {
            //     channel.consume(notiQueue, msg => {
            //         console.log('NotificationQueue successfully:', msg.content.toString())
            //         channel.ack(msg)
            //     })
            // }, 15000)

            //2. case failed

            channel.consume(notiQueue, msg => {
                try {
                    const number = Math.random();
                    console.log('number:', number)
                    if (number < 0.8)
                        throw new Error('Send notification failed: ' + number)
                    console.log('NotificationQueue successfully:', msg.content.toString())
                    channel.ack(msg)
                } catch (error) {
                    channel.nack(msg, false, false)
                }

            })

        } catch (error) {
            console.log(error)
        }
    },
    consumerToQueueFailed: async (queueName) => {
        try {
            const { channel, connect } = await connectToRabbitMQ()
            const notificationRoutingKeyXML = 'notificationRoutingKeyDLX'
            const notificationExchangeDLX = 'notificationExDLX'
            const notiQueueHandler = 'notificationQueueHotFix'
            await channel.assertExchange(notificationExchangeDLX, 'direct', {
                exclusive: false
            })
            const queueResult = await channel.assertQueue(notiQueueHandler, {
                exclusive: false
            })

            await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyXML)
            await channel.consume(queueResult.queue, msgFailed => {
                console.log('this notification error::', msgFailed.content.toString())
            })
        } catch (error) {
            console.log(error)
            throw error
        }
    }


}

module.exports = messagesService