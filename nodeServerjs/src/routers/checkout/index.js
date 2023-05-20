'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const checkOutController = require('../../controllers/checkout.controller');

const express = require('express');
const { authentication } = require('../../auth/checkAuth');
const router = express.Router();


router.post('/review', asyncHandler(checkOutController.checkoutReview))

module.exports = router