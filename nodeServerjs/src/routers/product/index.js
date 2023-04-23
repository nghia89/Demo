'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const productController = require('../../controllers/product.controller');

const express = require('express');
const router = express.Router();


router.post('/product/create', asyncHandler(productController.CreateProduct))

module.exports = router