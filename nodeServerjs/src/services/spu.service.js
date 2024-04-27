'use strict'

const { NotFoundError } = require("../core/error.response")
const { findShopById } = require("../models/repositories/shop.repo")
const spuModel = require("../models/spu.model")
const { randomProductId } = require("../utils")
const { newSku, allSkuBySpuId } = require("./sku.service")

const newSpu = async ({
    product_id,
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_category,
    product_shop,
    product_attributes,
    product_quantity,
    product_variations,
    sku_list = []
}) => {
    try {
        const foundShop = await findShopById({ shop_id: product_shop })

        if (!foundShop) throw new NotFoundError('Shop not found')

        const spu = await spuModel.create({
            product_id: randomProductId(),
            product_name,
            product_thumb,
            product_description,
            product_price,
            product_category,
            product_shop,
            product_attributes,
            product_quantity,
            product_variations,
        })

        if (spu && sku_list.length > 0) {
            newSku({ sku_list, spu_id: spu.product_id }).then()
        }

        //sync data elasticsearch

        return !!spu
    } catch (error) {
        console.log(error)
    }
}

const oneSpu = async ({ product_id }) => {
    const spu = await spuModel.findOne({ product_id })
    if (!spu)
        throw new NotFoundError('spu not found')
    const skus = await allSkuBySpuId({ product_id: spu.product_id })
    return {
        spu_info: spu,
        sku_list: skus
    }
}

module.exports = { newSpu, oneSpu }