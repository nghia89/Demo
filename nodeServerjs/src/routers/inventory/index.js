'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const inventoryController = require('../../controllers/inventory.controller');
const { authentication } = require('./../../auth/checkAuth')
const express = require('express');
const router = express.Router();


router.use(authentication)
router.post('', asyncHandler(inventoryController.addStockToInventory))



module.exports = router