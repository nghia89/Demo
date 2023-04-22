'use strict'

const { asyncHandler } = require('../../auth/checkAuth');
const accessController = require('../../controllers/access.controller');

const express = require('express')
const router = express.Router();


// singUp
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.logIn))

module.exports = router