const uuid = require('uuid')
const path = require('path')
const { Device, DeviceInfo } = require('../models/models')
const ApiError = require('../error/apiError')
class DeviceController {
    async getAll(req, res, next) {
        try {
            const { brandId, typeId, page = 1, limit = 9 } = req.query
            const numericPage = Number(page)
            const numericLimit = Number(limit)

            if (!Number.isInteger(numericPage) || numericPage < 1) {
                return next(ApiError.badRequest('Page must be a positive integer'))
            }
            if (!Number.isInteger(numericLimit) || numericLimit < 1) {
                return next(ApiError.badRequest('Limit must be a positive integer'))
            }

            const where = {}

            if (brandId !== undefined) {
                const numericBrandId = Number(brandId)
                if (!Number.isInteger(numericBrandId) || numericBrandId < 1) {
                    return next(ApiError.badRequest('Brand ID must be a positive integer'))
                }
                where.brandId = numericBrandId
            }

            if (typeId !== undefined) {
                const numericTypeId = Number(typeId)
                if (!Number.isInteger(numericTypeId) || numericTypeId < 1) {
                    return next(ApiError.badRequest('Type ID must be a positive integer'))
                }
                where.typeId = numericTypeId
            }

            const devices = await Device.findAndCountAll({
                where,
                limit: numericLimit,
                offset: numericLimit * (numericPage - 1)
            })

            return res.json(devices)
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;

            const device = await Device.findOne({
                where: { id },
                include: [{ model: DeviceInfo, as: 'info' }]
            });

            if (!device) {
                return next(ApiError.notFound('Device not found'));
            }

            return res.json(device);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async create(req, res, next) {
        try {
            let { name, price, brandId, typeId, info } = req.body
            const { img } = req.files
            let fileName = uuid.v4() + '.jpg'
            img.mv(path.resolve(__dirname, "..", 'static', fileName))

            const device = await Device.create({ name, price, brandId, typeId, img: fileName })
            if (info) {
                info = JSON.parse(info)
                info.array.forEach(element => {
                    DeviceInfo.create({
                        title: element.title,
                        description: element.description,
                        deviceId: device.id

                    })
                });
            }
            return res.json(device)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async update(req, res) {
        res.status(200).json({ message: "Hello from device update!", id: req.params.id });
    }

    async destroy(req, res) {
        res.status(200).json({ message: "Hello from device delete!", id: req.params.id });
    }
}

module.exports = new DeviceController();
