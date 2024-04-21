'use strict'
const { newOtp } = require('./otp.service')
const { getTemplate } = require('./template.service')
const transport = require('../dbs/init.nodemailer')
const { NotFoundError } = require('./../core/error.response')
const { replacePlaceholder } = require('../utils')
const sendEmailLinkVerify = ({
    html,
    toEmail,
    subject = 'Xác nhận đăng ký.!',
    text = '...'
}) => {
    try {
        const mailOption = {
            from: ' "ShopDEV" <anonystick@gmail.com> ',
            to: toEmail,
            subject,
            text,
            html
        }
        transport.sendMail(mailOption, (err, info) => {
            if (err)
                return console.log(err)
            return console.log('Message sent', info.messageId)
        })
    } catch (error) {
        console.log('error send enail::', error)
        return error;
    }
}


const sendEmailToken = async ({
    email = null
}) => {
    try {
        const token = await newOtp({ email })
        const template = await getTemplate({ tem_name: 'html email token' })

        if (!template)
            throw new NotFoundError('Template not found.')

        const content = replacePlaceholder(template.tem_html, { link_very: `http://localhost:3065/cgp/wellcome-back=${token.otp_token}` })
        sendEmailLinkVerify({
            html: content,
            toEmail: email,
            subject: 'Vui lòng xác nhận email đăng ký.'
        }).catch((err) => console.log(err))

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    sendEmailToken
}