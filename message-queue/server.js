'use strict';

const { consumerToQueue, consumerToQueueNormal, consumerToQueueFailed } = require('./src/services/consumerQueue.service');
const queueName = 'test-topic';

// consumerToQueue(queueName).then(() => {
//     console.log(`Message consumer started: ${queueName}`);
// }).catch(err => {
//     console.error(`message Error: ${err.message}`);
// })



consumerToQueueNormal(queueName).then(() => {
    console.log(`Message consumerToQueueNormal started: ${queueName}`);
}).catch(err => {
    console.error(`message Error: ${err.message}`);
})


consumerToQueueFailed(queueName).then(() => {
    console.log(`Message consumerToQueueFailed started: ${queueName}`);
}).catch(err => {
    console.error(`message Error: ${err.message}`);
})
