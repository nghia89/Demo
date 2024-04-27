'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const productController = require('../../controllers/product.controller');
const { authentication } = require('./../../auth/checkAuth')
const express = require('express');
const router = express.Router();



router.post('/product/search/:query', asyncHandler(productController.searchProductByUser))
router.get('/product/all', asyncHandler(productController.findAllProducts))
router.get('/product/:product_id', asyncHandler(productController.findProduct))

router.use(authentication)
router.post('/product/create', asyncHandler(productController.CreateProduct))
router.patch('/product/update/:productId', asyncHandler(productController.updateProduct))
router.post('/product/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/product/un_publish/:id', asyncHandler(productController.unPublishProductByShop))


router.get('/product/draft/all', asyncHandler(productController.findAllDraftsForShop))
router.get('/product/publish/all', asyncHandler(productController.findAllPublishForShop))


router.post('/spu/new', asyncHandler(productController.createSpu))
router.get('/sku/select_variation', asyncHandler(productController.findOneSku))
router.get('/spu/info', asyncHandler(productController.findOneSpu))

module.exports = router