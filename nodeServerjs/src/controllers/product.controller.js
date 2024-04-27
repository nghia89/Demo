'use strict'

const { OK, CREATED } = require("../core/success.response")
const ProductService = require("../services/product.service")
const SPUService = require("../services/spu.service")
const SKUService = require("../services/sku.service")

class ProductController {

    // spu, sku
    createSpu = async (req, res, next) => {
        new OK({
            message: 'Create spu Ok',
            metadata: await SPUService.newSpu({
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    findOneSku = async (req, res, next) => {
        const { sku_id, product_id } = req.query
        try {
            new OK({
                message: 'find sku Ok',
                metadata: await SKUService.oneSku({ sku_id, product_id })
            }).send(res)
        } catch (error) {
            next(error)
        }
    }
    findOneSpu = async (req, res, next) => {
        const { product_id } = req.query
        try {
            new OK({
                message: 'find spu Ok',
                metadata: await SPUService.oneSpu({ product_id })
            }).send(res)
        } catch (error) {
            next(error)
        }
    }
    //end spu, sku


    CreateProduct = async (req, res, next) => {
        new OK({
            message: 'Create Product Ok',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            }
            )
        }).send(res)
    }

    updateProduct = async (req, res, next) => {
        new OK({
            message: 'Update Product Ok',
            metadata: await ProductService.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    searchProductByUser = async (req, res, next) => {
        new OK({
            message: ' Product Search Ok',
            metadata: await ProductService.searchProductByUser({
                query: req.params.query
            }
            )
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new OK({
            message: 'findAllProducts Ok',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new OK({
            message: 'find Products Ok',
            metadata: await ProductService.findProduct({ product_id: req.params.product_id })
        }).send(res)
    }

    findAllDraftsForShop = async (req, res, next) => {
        new OK({
            message: 'Get Product Ok',
            metadata: await ProductService.findAllDraftsForShop({
                product_shop: req.user.userId
            }
            )
        }).send(res)
    }

    findAllPublishForShop = async (req, res, next) => {
        new OK({
            message: 'Get Product Publish Ok',
            metadata: await ProductService.findAllPublishForShop({
                product_shop: req.user.userId
            }
            )
        }).send(res)
    }

    publishProductByShop = async (req, res, next) => {
        new OK({
            message: ' Product Publish Ok',
            metadata: await ProductService.publishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            }
            )
        }).send(res)
    }

    unPublishProductByShop = async (req, res, next) => {
        new OK({
            message: ' Product UnPublish Ok',
            metadata: await ProductService.unPublishProductByShop({
                product_shop: req.user.userId,
                product_id: req.params.id
            }
            )
        }).send(res)
    }
}

module.exports = new ProductController()