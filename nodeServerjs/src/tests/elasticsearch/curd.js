const { init, getClients } = require('../../dbs/init.elasticsearch')

init({
    ELASTICSEARCH_IS_ENABLED: true
})


const esClient = getClients().elasticClient

const searchDocument = async (idxName, docType, payload) => {
    const result = await esClient.search({
        index: idxName,
        type: docType,
        body: payload
    })

    console.log(`search::`, result?.body?.hits?.hits)
}


const addDocument = async ({ idxName, _id, docType, payload }) => {
    try {
        const newDoc = await esClient.index({
            index: idxName,
            type: docType,
            id: _id,
            body: payload
        })
        return newDoc
    } catch (error) {

    }
}

/// test 

// addDocument({
//     idxName: 'product_0001',
//     _id: '112233',
//     docType: 'product',
//     payload: {
//         title: 'Iphone 15',
//         price: 12345,
//         images: '...',
//         category: 'iphone'
//     }
// }).then(rs => console.log(rs))


searchDocument('product_0001', 'product')

module.exports = {
    searchDocument,
    addDocument
}