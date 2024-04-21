'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const userController = require('../../controllers/user.controller');
const express = require('express');
const router = express.Router();

router.post('/new_user', asyncHandler(userController.newUser))



module.exports = router