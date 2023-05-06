'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')


const stringToObjectId = (value) => {
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


module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject,
    updateNestedObjectParse,
    stringToObjectId
}