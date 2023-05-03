'use strict'
const { Types } = require('mongoose')
const { product, electronic, clothing, furniture } = require('./../models/product.model')
const { BadRequestError } = require('./../core/error.response')
const { findAllDraftsForShop, findAllPublishForShop, publishProductByShop,
    unPublishProductByShop, searchProductByUser, findProduct,
    findAllProducts,
    updateProductById } = require('./../models/repositories/product.repo')
const { removeUndefinedObject, updateNestedObjectParse } = require('../utils')
const { insertInventory } = require('../models/repositories/inventory.repo')
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

    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!type) throw new BadRequestError(`Invalid Product Types ${type}`)
        return new productClass(payload).updateProduct(productId)
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

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true }, select = ['product_name', 'product_price', 'product_thumb'] }) {
        return await findAllProducts({ limit, sort, page, filter, select })
    }

    static async findProduct({ product_id, unSelect = ['__v'] }) {
        return await findProduct({ product_id, unSelect })
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
        const newProduct = await product.create({
            ...this,
            _id: id
        })
        if (newProduct) {
            await insertInventory({ productId: newProduct._id, shopId: this.product_shop, stock: this.product_quantity })
        }
        return newProduct
    }

    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product })
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


    async updateProduct(productId) {
        const objectParams = removeUndefinedObject(this)
        if (objectParams.product_attributes) {
            await updateProductById({ productId, bodyUpdate: updateNestedObjectParse(objectParams.product_attributes), model: clothing })
        }

        const updateProduct = await super.updateProduct(productId, updateNestedObjectParse(objectParams))
        return updateProduct
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