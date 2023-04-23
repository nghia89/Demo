'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const accessController = require('../../controllers/access.controller');

const express = require('express');
const { authentication } = require('../../auth/checkAuth');
const router = express.Router();


// singUp
router.post('/shop/signup', asyncHandler(accessController.signUp))
router.post('/shop/login', asyncHandler(accessController.logIn))

router.use(authentication)

router.post('/shop/logout', asyncHandler(accessController.logOut))

module.exports = router