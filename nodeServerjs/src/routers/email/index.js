'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const emailController = require('../../controllers/email.controller');
const express = require('express');
const router = express.Router();

router.post('/new_template', asyncHandler(emailController.newTemplate))



module.exports = router