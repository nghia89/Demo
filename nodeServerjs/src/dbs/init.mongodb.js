'use strict'

const mongoose = require('mongoose')

const { countConnect } = require('../helpers/check.connect')
const { db: { host, port, name } } = require('../configs/config.mongodb')

const connectString = `mongodb://${host}:${port}/${name}`
console.log('connectString::', connectString)
class Database {
    constructor() {
        this.connect()
    }

    //connect

    connect(type = "mongodb") {
        //dev
        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }

        mongoose.connect(connectString, {
            maxPoolSize: 50
        }).then(_ => console.log('Connected MongoDb Success'), countConnect())
            .catch(err => console.log('Error connect!'))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}
const instanceMongoDb = Database.getInstance()
module.exports = instanceMongoDb;