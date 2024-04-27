'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')


const stringToObjectId = (value) => {
    if (!value) return null
    return new Types.ObjectId(value)
}

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

const getUnSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = (object) => {
    if (object == null) return object;
    Object.keys(object).forEach(key => {
        if (!object[key])
            delete object[key]
    })

    return object
}

const updateNestedObjectParse = object => {
    const final = {};

    Object.keys(object || {}).forEach(key => {
        if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
            const response = updateNestedObjectParse(object[key]);

            Object.keys(response || {}).forEach(a => {
                final[`${key}.${a}`] = response[a];
            });
        } else {
            final[key] = object[key];
        }
    });

    return final;
}

const replacePlaceholder = (template, params) => {
    Object.keys(params).forEach(k => {
        const placeholder = `{{${k}}}`
        console.log(placeholder)
        template = template.replace(new RegExp(placeholder, 'g'), params[k])
    })
    return template
}

const randomProductId = () => {
    return Math.floor(Math.random() * 899999_100000)
}

module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject,
    updateNestedObjectParse,
    stringToObjectId,
    replacePlaceholder,
    randomProductId
}