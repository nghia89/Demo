'use strict'
const { OK } = require('./../core/success.response')
const { newTemplate } = require('./../services/template.service')
class EmailController {
    newTemplate = async (req, res, next) => {
        console.log('req.body', req.body)
        new OK({
            message: 'Create new template success',
            metadata: await newTemplate(req.body)
        }).send(res)
    }
}

module.exports = new EmailController()