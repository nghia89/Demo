'use strict'

const express = require('express');
const { apiKey, permission } = require('../auth/checkAuth');
const router = express.Router();

//check apiKey
router.use('/v1/api/upload', require('./upload'))
router.use(apiKey)
router.use(permission('0000'))

router.use('/v1/api/checkout', require('./checkout'))
router.use('/v1/api/profile', require('./profile'))
router.use('/v1/api/cart', require('./cart'))
router.use('/v1/api', require('./access'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api', require('./product'))
router.use('/v1/api', require('./comment'))
router.use('/v1/api', require('./inventory'))
router.use('/v1/api', require('./notification'))

module.exports = router