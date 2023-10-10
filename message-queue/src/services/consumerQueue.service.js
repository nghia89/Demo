'use strict';

const {
    consumerQueue,
    connectToRabbitMQ
} = require('../dbs/init.rabbit')


const messagesService = {
    consumerToQueue: async (queueName) => {
        try {
            const { channel, connect } = await connectToRabbitMQ()
            await consumerQueue(channel, queueName);
        } catch (e) {
            console.error('Error consumerToRabbit', e);
        }
    }
}

module.exports = messagesService