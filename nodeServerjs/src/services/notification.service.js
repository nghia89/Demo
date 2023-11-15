'use strict'
const { NOTI } = require('./../models/notification.model')

const pushNotifyToSystem = async ({
    type = 'SHOP-001',
    receivedId = 1,
    senderId = 1,
    options = {}
}) => {
    let noti_content
    if (type == 'SHOP-001')
        noti_content = `@@@ vừa mới thêm một sản phẩm: @@@`
    else if (type == 'PROMOTION-001')
        noti_content = `@@@ vừa mới một voucher: @@@`

    const newNoti = await NOTI.create({
        noti_type: type,
        noti_content: noti_content,
        noti_sender: senderId,
        noti_receivedId: receivedId,
        noti_options: options
    })
    return newNoti;
}

const listNotiByUser = async ({
    userId = 1,
    type = 'All',
    isRead = 0
}) => {
    const match = { noti_receivedId: userId }

    if (type !== 'All') {
        match['noti_type'] = type
    }
    return await NOTI.aggregate([
        {
            $match: match
        }
    ])
}

module.exports = {
    pushNotifyToSystem,
    listNotiByUser
}