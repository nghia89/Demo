'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const productController = require('../../controllers/product.controller');
const { authentication } = require('./../../auth/checkAuth')
const express = require('express');
const router = express.Router();



router.post('/product/search/:query', asyncHandler(productController.searchProductByUser))

router.use(authentication)
router.post('/product/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/product/un_publish/:id', asyncHandler(productController.unPublishProductByShop))


router.get('/product/draft/all', asyncHandler(productController.findAllDraftsForShop))
router.get('/product/publish/all', asyncHandler(productController.findAllPublishForShop))
router.get('/product/all', asyncHandler(productController.findAllProducts))
router.get('/product/:product_id', asyncHandler(productController.findProduct))

module.exports = router