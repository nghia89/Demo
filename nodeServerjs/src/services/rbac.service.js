'use strict';


const Resource = require('./../models/resource.model')
const Role = require('./../models/role.model')


const createResource = async ({
    name = 'profile',
    slug = 'p0001',
    description = ''
}) => {
    try {
        const resource = await Resource.create({
            src_name: name,
            src_slug: slug,
            src_description: description
        })
        return resource;
    } catch (error) {
        console.log(error)
    }
}


const resourceList = async ({
    userId = 0,
    limit = 30,
    offset = 0,
    search = ''
}) => {
    try {
        const resources = await Resource.aggregate([
            {
                $project: {
                    name: "$src_name",
                    slug: '$src_slug',
                    resourceId: '$_id',
                    description: '$src_description'
                }
            }
        ])
        return resources;
    } catch (error) {
        console.log(error)
    }
}



const createRole = async ({
    name = 'shop',
    slug = 's0001',
    description = 'extend from shop or user',
    grants = []
}) => {
    try {
        const role = await Role.create({
            role_name: name,
            role_slug: slug,
            role_description: description,
            role_grants: grants

        })
        return role;
    } catch (error) {
        console.log(error)
    }
}



const roleList = async ({
    userId = 0,
    limit = 30,
    offset = 0,
    search = ""
}) => {
    try {
        const roles = Role.aggregate([
            {
                $unwind: '$role_grants'
            },
            {
                $lookup: {
                    from: 'Resources',
                    localField: 'role_grants.resource',
                    foreignField: '_id',
                    as: 'resource'
                }
            }, {
                $unwind: '$resource'
            }, {
                $project: {
                    role: '$role_name',
                    resource: '$resource.src_name',
                    action: '$role_grants.actions',
                    attributes: '$role_grants.attributes'
                }
            }, { $unwind: '$action' },
            {
                $project: {
                    role: 1,
                    resource: 1,
                    action: '$action',
                    attributes: 1
                }
            }
        ])
        return roles
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    createResource,
    resourceList,
    createRole,
    roleList
}