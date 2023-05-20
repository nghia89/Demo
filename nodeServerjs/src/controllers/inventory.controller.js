'use strict'

const { OK } = require("../core/success.response")
const InventoryService = require("../services/inventory.service")

class InventoryOutController {

    addStockToInventory = async (req, res, next) => {
        new OK({
            message: 'Create new inventory success',
            metadata: await InventoryService.AddStockToInventory(req.body)
        }).send(res)
    }


}

module.exports = new InventoryOutController()