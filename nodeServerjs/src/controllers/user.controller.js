


class UserController {
    newUser = async (req, res, next) => {
        new OK({
            message: 'Upload file Ok',
            metadata: await UploadService.uploadImageFromUrl()
        }).send(res)
    }

    checkRegisterEmailToken = async () => {

    }

}

module.exports = new UserController()