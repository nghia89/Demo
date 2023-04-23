'use strict'

const { product, electronic, clothing } = require('./../models/product.model')
const { BadRequestError } = require('./../core/error.response')
// define Factory class to product
class ProductFactory {
    static async createProduct(type, payload) {
        switch (type) {
            case "Electronic":
                return new Electronic(payload).createProduct()
            case "Clothing":
                return new Clothing(payload).createProduct()

            default:
                throw new BadRequestError(`Invalid Product Types ${type}`)
        }
    }
}

class Product {
    constructor({
        product_name, product_thumb, product_description, product_attributes,
        product_price, product_quantity, product_type, product_shop
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_attributes = product_attributes
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
    }

    async createProduct() {
        return await product.create(this)
    }
}


class Clothing extends Product {
    async createProduct() {
        console.log('newClothing', this.product_attributes)
        const newClothing = await clothing.create(this.product_attributes)

        if (!newClothing) throw new BadRequestError('create new clothing error')

        const newProduct = await super.createProduct();
        if (!newProduct) throw new BadRequestError('create new product error')
        return newProduct
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create(this.product_attributes)
        if (!newElectronic) throw new BadRequestError('create new Electronic error')

        const newProduct = await super.createProduct();
        if (!newProduct) throw new BadRequestError('create new product error')
        return newProduct
    }
}

module.exports = ProductFactory