'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const cartController = require('../../controllers/cart.controller');
const { authentication } = require('./../../auth/checkAuth')
const express = require('express');
const router = express.Router();



router.post('', asyncHandler(cartController.addToCart))
router.delete('', asyncHandler(cartController.delete))
router.put('/update', asyncHandler(cartController.updateCart))
router.get('', asyncHandler(cartController.listToCart))


module.exports = router