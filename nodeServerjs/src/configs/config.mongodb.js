

const dev = {
    app: {
        port: process.env.DEV_APP_HOST || 3000
    },
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'shopDev'
    }
}

const pro = {
    app: {
        port: process.env.PRO_APP_HOST || 3000
    },
    db: {
        host: process.env.PRO_DB_HOST || 'localhost',
        port: process.env.PRO_DB_PORT || 27017,
        name: process.env.PRO_DB_NAME || 'shopPro'
    }
}
console.log('NODE_ENV', process.env.NODE_ENV)
const config = { dev, pro }
const env = process.env.NODE_ENV || 'dev'

module.exports = config[env]