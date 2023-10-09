'use strict';

const { connectToRabbitMQForTesting } = require('../dbs/init.rabbit')

describe('amqpConnection', () => {
    it('should connect to successful RabbitMQ', async () => {
        const result = await connectToRabbitMQForTesting()
        expect(result).toBeUndefined();
    });
});