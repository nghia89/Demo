'use strict'

const { OK, CREATED } = require("../core/success.response")
const UploadService = require("../services/upload.service")
const UploadServiceS3 = require("../services/upload.service")


class UploadController {

    UploadFile = async (req, res, next) => {
        new OK({
            message: 'Upload file Ok',
            metadata: await UploadService.uploadImageFromUrl()
        }).send(res)
    }

    UploadFileS3 = async (req, res, next) => {
        const { file } = req
        if (!file) throw new BadRequestError("File missing")
        new OK({
            message: 'Upload file Ok',
            metadata: await UploadServiceS3.uploadImageFromLocalS3({ file })
        }).send(res)
    }


}

module.exports = new UploadController()