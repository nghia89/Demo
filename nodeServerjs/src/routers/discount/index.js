'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const discountController = require('../../controllers/discount.controller');
const { authentication } = require('./../../auth/checkAuth')
const express = require('express');
const router = express.Router();



router.post('/amount', asyncHandler(discountController.getDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProduct))

router.use(authentication)
router.post('', asyncHandler(discountController.createDiscountCode))
router.post('list_with_product', asyncHandler(discountController.getAllDiscountCodesWithProduct))

module.exports = router