'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const uploadController = require('../../controllers/upload.controller');
const express = require('express');
const { uploadMemory } = require('../../configs/multer.config');
const router = express.Router();



router.post('/uploadImage', asyncHandler(uploadController.UploadFile))
router.post('/bucket', uploadMemory.single('file'), asyncHandler(uploadController.UploadFileS3))

module.exports = router