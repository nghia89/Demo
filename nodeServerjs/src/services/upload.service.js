'use strict'

const cloudinary = require('../configs/cloudinary.config')

const uploadImageFromUrl = async () => {
    try {
        const urlImage = 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lniv57vq5rzh77'
        const folderName = 'product/shopId', newFileName = 'test'
        const result = await cloudinary.uploader.upload(urlImage, {
            // public_id:newFileName
            folder: folderName
        })
        return result;
    } catch (error) {

    }
}

module.exports = {
    uploadImageFromUrl
}