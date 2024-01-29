'use strict'

const asyncHandler = require('../../helpers/asyncHandler');
const { profiles, profile } = require('../../controllers/profile.controller');
const { authentication } = require('./../../auth/checkAuth')
const { grandAccess } = require('./../../middleware/rbac')
const express = require('express');
const router = express.Router();


router.get('/viewAny', grandAccess('readAny', 'profile'), profiles)


router.get('/viewOwn', grandAccess('readOwn', 'profile'), profile)


module.exports = router