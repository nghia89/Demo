'use strict'

const skuModel = require("../models/sku.model")
const { randomProductId } = require("../utils")
const _ = require('lodash')
const { CACHE_PRODUCT } = require('./../configs/constant')
const { setCacheExpiration, getCacheIO } = require("../models/repositories/cache.repo")
const newSku = async ({
    spu_id, sku_list
}) => {
    try {
        const conver_sku_list = sku_list.map(sku => {
            return { ...sku, product_id: spu_id, sku_id: `${spu_id}.${randomProductId()}` }
        })
        const skus = await skuModel.create(conver_sku_list)
        return skus;
    } catch (error) {
        return []
    }
}

const oneSku = async ({ sku_id, product_id }) => {

    if (sku_id < 0) return null
    if (product_id < 0) return null

    const skuKeyCache = `${CACHE_PRODUCT.SKU}${sku_id}`
    let skuCache = await getCacheIO({ key: skuKeyCache })
    if (skuCache) {
        return {
            ...JSON.parse(skuCache),
            toLoad: 'cache'
        }
    }

    if (!skuCache) {
        skuCache = await skuModel.findOne({
            sku_id, product_id
        }).lean()
        const valueCache = skuCache ? skuCache : null
        setCacheExpiration({
            key: skuKeyCache,
            value: JSON.stringify(valueCache),
            expirationInSeconds: 30
        }).then()
        return {
            skuCache,
            toLoad: 'dbs'
        }
    }

    // const sku = await skuModel.findOne({
    //     sku_id, product_id
    // }).lean()
    // // if (sku)
    // //     //set cache
    // return _.omit(sku, ['__v', 'updatedAt'])
}

const allSkuBySpuId = async ({ product_id }) => {
    const skus = await skuModel.find({ product_id }).lean()
    return skus
}

module.exports = { newSku, oneSku, allSkuBySpuId }