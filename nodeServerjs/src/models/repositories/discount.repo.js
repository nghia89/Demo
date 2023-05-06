'use strict'

const { stringToObjectId, getUnSelectData, getSelectData } = require("../../utils")
const { discount } = require("../discount.model")


const getFoundDiscount = async ({ code, shopId }) => {
    return await discount.findOne({
        discount_code: code,
        discount_shopId: stringToObjectId(shopId)
    }).lean()
}

const findAllDiscountCodesUnSelect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, unSelect
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort = 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await discount.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getUnSelectData(unSelect))
        .lean()
    return documents
}


const findAllDiscountCodesSelect = async ({
    limit = 50, page = 1, sort = 'ctime', filter, select
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort = 'ctime' ? { _id: -1 } : { _id: 1 }
    const documents = await discount.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    return documents
}

module.exports = {
    getFoundDiscount,
    findAllDiscountCodesUnSelect,
    findAllDiscountCodesSelect
}