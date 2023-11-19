'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const uploadController = require('../../controllers/upload.controller');
const express = require('express');
const router = express.Router();



router.post('/uploadImage', asyncHandler(uploadController.UploadFile))

module.exports = router