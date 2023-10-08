'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const commentController = require('../../controllers/comment.controller');
const { authentication } = require('./../../auth/checkAuth')
const express = require('express');
const router = express.Router();

router.use(authentication)
router.post('/comment/create', asyncHandler(commentController.CreateComment))
router.get('/comment/get', asyncHandler(commentController.GetComment))
router.delete('/comment/delete', asyncHandler(commentController.DeleteComment))

module.exports = router