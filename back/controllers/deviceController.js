const uuid = require('uuid')
const path = require('path')
const { Device, DeviceInfo } = require('../models/models')
const ApiError = require('../error/apiError')
class DeviceController {
    async getAll(req, res) {
        let { brandId, typeId, limit, page } = req.query
        page = page || 1
        limit = limit || 9
        let offset = limit * page - limit
        let devices
        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({ limit, offset })

        } else if (brandId && !typeId) {
            devices = await Device.findAndCountAll({ where: { brandId, limit, offset } })

        } else if (typeId && !brandId) {
            devices = await Device.findAndCountAll({ where: { typeId, limit, offset } })


        } else if (brandId, typeId) {
            devices = await Device.findAndCountAll({ where: { typeId, brandId, limit, offset } })


        }
        return res.json(devices);
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
