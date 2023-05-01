'use strict'
const { Types } = require('mongoose')
const { product, electronic, clothing, furniture } = require('./../models/product.model')
const { BadRequestError } = require('./../core/error.response')
const { findAllDraftsForShop, findAllPublishForShop, publishProductByShop, unPublishProductByShop, searchProductByUser } = require('./../models/repositories/product.repo')
// define Factory class to product
class ProductFactory {

    static productRegistry = {}

    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!type) throw new BadRequestError(`Invalid Product Types ${type}`)
        return new productClass(payload).createProduct()
        // switch (type) {
        //     case "Electronic":
        //         return new Electronic(payload).createProduct()
        //     case "Clothing":
        //         return new Clothing(payload).createProduct()

        //     default:
        //         throw new BadRequestError(`Invalid Product Types ${type}`)
        // }
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id });
    }
    static async searchProductByUser({ query }) {
        return await searchProductByUser({ query });
    }

    static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop: new Types.ObjectId(product_shop), isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop: new Types.ObjectId(product_shop), isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }

    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id });
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

    async createProduct(id) {
        return await product.create({
            ...this,
            _id: id
        })
    }
}


class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })

        if (!newClothing) throw new BadRequestError('create new clothing error')
        const newProduct = await super.createProduct(newClothing._id);

        if (!newProduct) throw new BadRequestError('create new product error')
        return newProduct
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })

        if (!newFurniture) throw new BadRequestError('create new Furniture error')

        const newProduct = await super.createProduct(newFurniture._id);
        if (!newProduct) throw new BadRequestError('create new product error')
        return newProduct
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError('create new Electronic error')

        const newProduct = await super.createProduct(newElectronic._id);
        if (!newProduct) throw new BadRequestError('create new product error')
        return newProduct
    }
}

ProductFactory.registerProductType("Electronics", Electronic)
ProductFactory.registerProductType("Clothing", Clothing)
ProductFactory.registerProductType("Furniture", Furniture)

module.exports = ProductFactory