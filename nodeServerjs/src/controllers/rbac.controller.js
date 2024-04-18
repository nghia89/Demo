'use strict'

const { OK } = require("../core/success.response")
const rbacService = require("../services/rbac.service")

class RBACController {

    addResource = async (req, res, next) => {
        new OK({
            message: 'Create new resource success',
            metadata: await rbacService.createResource({ ...req.body })
        }).send(res)
    }

    listResource = async (req, res, next) => {
        new OK({
            message: 'Get list resource success',
            metadata: await rbacService.resourceList(req.query)
        }).send(res)
    }

    addRole = async (req, res, next) => {
        new OK({
            message: 'Create new role success',
            metadata: await rbacService.createRole({ ...req.body })
        }).send(res)
    }

    listRole = async (req, res, next) => {
        new OK({
            message: 'Get list role success',
            metadata: await rbacService.roleList(req.query)
        }).send(res)
    }
}

module.exports = new RBACController()