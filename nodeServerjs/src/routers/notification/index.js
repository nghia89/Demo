'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const notificationController = require('../../controllers/notification.controller');
const { authentication } = require('./../../auth/checkAuth')
const express = require('express');
const router = express.Router();


router.use(authentication)
router.get('/notification/list', asyncHandler(notificationController.listNotiByUser))


module.exports = router