'use strict'

const cloudinary = require('../configs/cloudinary.config')
const { S3, PutObjectCommand, GetObjectCommand, DeleteBucketCommand } = require('./../configs/s3.config')
// const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const urlPublic = 'https://d1pgz3qfz14nn0.cloudfront.net';
const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
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
        const imageName = Crypto.randomBytes(16).toString('hex')
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: imageName,
            Body: file.buffer,
            ContentType: 'image/jpeg'
        })
        let result = await S3.send(command);
        const url = `${urlPublic}/${imageName}`;
        const privateKey = process.env.AWS_BUCKET_PUBLIC_KEY_ID;
        const keyPairId = "K28E7PNBLSAUKG";
        const dateLessThan = new Date(Date.now() + 1000 * 60);
        const signedUrl = getSignedUrl({
            url,
            keyPairId,
            dateLessThan,
            privateKey,
        });
        return {
            url: signedUrl,
            result: result
        };
    } catch (error) {
        console.log('uploadImageFromLocalS3', error)
    }
}

module.exports = {
    uploadImageFromUrl,
    uploadImageFromLocalS3
}