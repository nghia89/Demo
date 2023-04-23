'use strict'

const { OK, CREATED } = require("../core/success.response")
const ProductService = require("../services/product.service")


class ProductController {

    CreateProduct = async (req, res, next) => {
        new OK({
            message: 'Create Product Ok',
            metadata: await ProductService.createProduct(req.body.product_type, req.body)
        }).send(res)
    }
}

module.exports = new ProductController()