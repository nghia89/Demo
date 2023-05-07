'use strict'

const { discount } = require("../models/discount.model")
const { getFoundDiscount, findAllDiscountCodesUnSelect } = require("../models/repositories/discount.repo")
const { stringToObjectId } = require("../utils")
const { BadRequestError, NotFoundError } = require('./../core/error.response')
const { findAllProducts } = require('./../models/repositories/product.repo')
class DiscountService {
    static async createDiscountCode(body) {
        const { code, shopId, start_date, end_date, name,
            product_ids, description, type, value, min_order_value,
            max_uses, uses_count, users_used, max_uses_per_user,
            is_active, applies_to
        } = body

        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must be before end_date')
        }
        console.log('body', body)
        const foundDiscount = await getFoundDiscount({ code, shopId })
        console.log('foundDiscount', foundDiscount)
        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exists')
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_type: type,
            discount_description: description,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_users_used: users_used,
            discount_shopId: shopId,
            discount_max_uses_per_user: max_uses_per_user,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: product_ids
        })

        return newDiscount;
    }

    static async getAllDiscountCodesWithProduct({ code, shopId, userId, limit, page }) {
        console.log(shopId)
        const foundDiscount = await getFoundDiscount({ code, shopId })
        if (!foundDiscount || !foundDiscount?.discount_is_active) {
            throw new NotFoundError('Discount not exists')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if (discount_applies_to == 'all') {
            products = await findAllProducts({
                filter: {
                    product_shop: stringToObjectId(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['_id', 'product_name']
            })
        }

        if (discount_applies_to == 'specific') {
            products = await findAllProducts({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['_id', 'product_name']
            })
        }
        return products
    }
    static async getAllDiscountCodesByShop({
        limit, page, shopId
    }) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: stringToObjectId(shopId),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId']
        })
        return discounts
    }

    static async getDiscountAmount({ userId, codeId, shopId, products }) {
        const foundDiscount = await getFoundDiscount({ code, shopId })
        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount exists')
        }
        const { discount_type, discount_value, discount_is_active, discount_max_uses,
            discount_min_order_value, discount_max_uses_per_user } = foundDiscount

        if (!discount_is_active) throw new NotFoundError('discount expried')
        if (!discount_max_uses) throw new NotFoundError('discount are out')
        let totalOrder = 0
        if (discount_min_order_value > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError(`discount requires a minium order value of ${discount_min_order_value}`)
            }
        }

        if (discount_max_uses_per_user > 0) {
            const userUserDiscount = discount_users_used.find(user => user.userId == userId)
            if (userUserDiscount) {
                // ...
            }
        }

        const amount = discount_type == 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscount({ shopId, codeId }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: stringToObjectId(shopId)
        })

        return deleted
    }

    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundDiscount = await getFoundDiscount({ code, shopId })
        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount exists')
        }

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })
        return result
    }
}

module.exports = DiscountService