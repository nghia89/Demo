'use strict'

const cloudinary = require('../configs/cloudinary.config')
const { S3, PutObjectCommand } = require('./../configs/s3.config')
const Crypto = require('crypto')
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

const uploadImageFromLocalS3 = async ({ file }) => {
    try {
        const randomName = () => Crypto.randomBytes(16).toString('hex')
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: randomName(),
            Body: file.buffer,
            ContentType: 'image/jpeg'
        })
        let result = await S3.send(command);
        return result;
    } catch (error) {
        console.log('uploadImageFromLocalS3', error)
    }
}

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocalS3
}