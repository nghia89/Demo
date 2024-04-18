'use strict';
const { AuthFailureError } = require('../core/error.response');
const { roleList } = require('../services/rbac.service');
const rbac = require('./role.middleware')

const grandAccess = (action, resource) => {

    return async (req, res, next) => {
        try {
            rbac.setGrants(await roleList({ userId: 9999 }))
            const role_name = req.query.role;
            console.log('resource', resource)

            const permission = rbac.can(role_name).readAny('profile');
            // console.log('rbac.can(role_name)', rbac.can(role_name).readAny('profile'))
            if (!permission?.granted) {
                throw new AuthFailureError('you don`t have enough permission...  ')
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}

module.exports = { grandAccess }