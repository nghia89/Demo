'use strict'

const { Client } = require('@elastic/elasticsearch')
let clients = {}


const instanceEventListeners = async (elasticsearchClient) => {
    try {
        await elasticsearchClient.ping()
        console.log(`Successfully connected elasticsearch`)
    } catch (error) {
        console.log(`Error connecting to elasticsearch`, error)
    }
}

const init = ({
    ELASTICSEARCH_IS_ENABLED,
    ELASTICSEARCH_HOST = 'http://localhost:9200'
}) => {
    if (ELASTICSEARCH_IS_ENABLED) {
        const elasticsearchClient = new Client({ node: ELASTICSEARCH_HOST })
        clients.elasticClient = elasticsearchClient

        instanceEventListeners(elasticsearchClient)
    }
}

const getClients = () => clients


module.exports = {
    init,
    getClients
}