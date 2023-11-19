'use strict'

const { OK, CREATED } = require("../core/success.response")
const UploadService = require("../services/upload.service")


class UploadController {

    UploadFile = async (req, res, next) => {
        new OK({
            message: 'Upload file Ok',
            metadata: await UploadService.uploadImageFromUrl()
        }).send(res)
    }


}

module.exports = new UploadController()