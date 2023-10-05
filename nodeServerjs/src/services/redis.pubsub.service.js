//const Redis = require('redis')
const Redis = require('ioredis');
class RedisPubSubService {
    constructor() {
        this.subscriber = Redis.createClient({
            port: 6379,
            host: '127.0.0.1'
        });

        this.publisher = Redis.createClient({
            port: 6379,
            host: '127.0.0.1'
        });
    }

    publish(channel, message) {
        return new Promise((resovel, reject) => {
            this.publisher.publish(channel, message, (error, reply) => {
                if (error) {
                    reject(error)
                } else
                    resovel(reply)
            })
        })
    }

    subscribe(channel, callback) {
        this.subscriber.subscribe(channel)
        this.subscriber.on('message', (subscriberChannel, message) => {
            if (channel === subscriberChannel) {
                callback(channel, message)
            }
        })
    }
}

module.exports = new RedisPubSubService()