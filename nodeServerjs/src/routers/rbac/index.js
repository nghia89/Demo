'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const rbacController = require('../../controllers/rbac.controller');
const { authentication } = require('./../../auth/checkAuth')
const express = require('express');
const router = express.Router();


router.use(authentication)
router.post('/resource', asyncHandler(rbacController.addResource))
router.get('/resources', asyncHandler(rbacController.listResource))
router.post('/role', asyncHandler(rbacController.addRole))
router.get('/roles', asyncHandler(rbacController.listRole))


module.exports = router