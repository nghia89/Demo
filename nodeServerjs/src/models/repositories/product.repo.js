'use strict'

const { Types } = require('mongoose')
const { product, clothing, furniture, electronic } = require('./../product.model')
const { getSelectData, getUnSelectData } = require('../../utils')


const updateProductById = async ({
    productId,
    bodyUpdate,
    model,
    isNew = true
}) => {
    return await model.findByIdAndUpdate(productId, bodyUpdate, { new: isNew })
}

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await product.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()

    return products;
}

const findProduct = async ({ product_id, unSelect }) => {
    return await product.findById(product_id).select(getUnSelectData(unSelect))
}

const searchProductByUser = async ({ query }) => {
    const searchRegex = new RegExp(query)
    const results = await product.find(
        {
            isPublished: true,
            $text: { $search: searchRegex }
        },
        {
            score: { $meta: 'textScore' }
        })
        .sort({ score: { $meta: 'textScore' } })
        .lean()

    return results
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundProduct) return null

    foundProduct.isDraft = false
    foundProduct.isPublished = true
    const { modifiedCount } = await product.updateOne(foundProduct)

    return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    })
    if (!foundProduct) return null

    foundProduct.isDraft = false
    foundProduct.isPublished = false
    const { modifiedCount } = await product.updateOne(foundProduct)

    return modifiedCount
}


module.exports = {
    findAllDraftsForShop,
    findAllPublishForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProductByUser,
    findAllProducts,
    findProduct,
    updateProductById
}