'use strict'
const TEMPLATE = require('./../models/template.model')
const { htmlEmailToken } = require('./../utils/template_email')

const newTemplate = async ({
    tem_id = null,
    tem_name = null,
    tem_html = nul
}) => {
    console.log('tem_id', tem_id, tem_name, htmlEmailToken())
    const newTem = await TEMPLATE.create({
        tem_id,
        tem_name,
        tem_html: htmlEmailToken()
    })
    return newTem;
}

const getTemplate = async ({
    tem_name
}) => {
    const template = await TEMPLATE.findOne({ tem_name })
    return template;
}


module.exports = {
    newTemplate,
    getTemplate
}