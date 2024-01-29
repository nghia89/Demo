'use strict';
const { AuthFailureError } = require('../core/error.response');
const rbac = require('./role.middleware')

const grandAccess = (action, resource) => {

    return async (req, res, next) => {
        try {
            const role_name = req.query.role;
            const permission = rbac.can(role_name)[action][resource];
            if (!permission?.granted) {
                throw new AuthFailureError('you don`t have enough permission...  ')
            }
        } catch (error) {
            next(error)
        }
    }
}

module.exports = { grandAccess }