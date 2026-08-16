const { Basket, BasketDevice, Device } = require('../models/models')
const ApiError = require('../error/apiError')

async function findOrCreateUserBasket(userId) {
    const [basket] = await Basket.findOrCreate({ where: { userId } })
    return basket
}

async function getBasketWithDevices(userId) {
    return Basket.findOne({
        where: { userId },
        include: [{
            model: BasketDevice,
            include: [{ model: Device }]
        }]
    })
}

function parseDeviceId(value) {
    const deviceId = Number(value)
    return Number.isInteger(deviceId) && deviceId > 0 ? deviceId : null
}

class BasketController {
    async get(req, res, next) {
        try {
            await findOrCreateUserBasket(req.user.id)
            const basket = await getBasketWithDevices(req.user.id)
            return res.json(basket)
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }

    async add(req, res, next) {
        try {
            const deviceId = parseDeviceId(req.body.deviceId)
            if (!deviceId) {
                return next(ApiError.badRequest('Device ID must be a positive integer'))
            }

            const device = await Device.findByPk(deviceId)
            if (!device) {
                return res.status(404).json({ message: 'Device not found' })
            }

            const basket = await findOrCreateUserBasket(req.user.id)
            const [, created] = await BasketDevice.findOrCreate({
                where: { basketId: basket.id, deviceId },
                defaults: { basketId: basket.id, deviceId }
            })

            const result = await getBasketWithDevices(req.user.id)
            return res.status(created ? 201 : 200).json(result)
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }

    async remove(req, res, next) {
        try {
            const deviceId = parseDeviceId(req.params.deviceId)
            if (!deviceId) {
                return next(ApiError.badRequest('Device ID must be a positive integer'))
            }

            const basket = await Basket.findOne({ where: { userId: req.user.id } })
            if (!basket) {
                return res.status(404).json({ message: 'Basket not found' })
            }

            const deleted = await BasketDevice.destroy({
                where: { basketId: basket.id, deviceId }
            })
            if (!deleted) {
                return res.status(404).json({ message: 'Device is not in the basket' })
            }

            const result = await getBasketWithDevices(req.user.id)
            return res.json(result)
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }

    async clear(req, res, next) {
        try {
            const basket = await findOrCreateUserBasket(req.user.id)
            const removed = await BasketDevice.destroy({ where: { basketId: basket.id } })
            return res.json({ message: 'Basket cleared successfully!', removed })
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new BasketController()
