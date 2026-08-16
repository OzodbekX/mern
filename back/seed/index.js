require('dotenv').config();

const bcrypt = require('bcrypt');
const sequelize = require('../db');
const {
    User,
    Basket,
    BasketDevice,
    Device,
    Type,
    Brand,
    Rating,
    DeviceInfo,
    TypeBrand
} = require('../models/models');

const users = require('./data/users');
const types = require('./data/types');
const brands = require('./data/brands');
const devices = require('./data/devices');
const typeBrands = require('./data/typeBrands');
const baskets = require('./data/baskets');
const basketDevices = require('./data/basketDevices');
const ratings = require('./data/ratings');
const deviceInfos = require('./data/deviceInfos');

async function upsertAndGet(Model, where, values, transaction) {
    const [record, created] = await Model.findOrCreate({
        where,
        defaults: values,
        transaction
    });

    if (!created) {
        await record.update(values, { transaction });
    }

    return record;
}

async function seed() {
    await sequelize.authenticate();
    await sequelize.sync();

    await sequelize.transaction(async (transaction) => {
        const typeByName = new Map();
        const brandByName = new Map();
        const userByEmail = new Map();
        const basketByEmail = new Map();
        const deviceByName = new Map();

        for (const values of types) {
            const type = await upsertAndGet(Type, { name: values.name }, values, transaction);
            typeByName.set(type.name, type);
        }

        for (const values of brands) {
            const brand = await upsertAndGet(Brand, { name: values.name }, values, transaction);
            brandByName.set(brand.name, brand);
        }

        for (const values of users) {
            const password = await bcrypt.hash(values.password, 5);
            const user = await upsertAndGet(
                User,
                { email: values.email },
                { email: values.email, password, role: values.role },
                transaction
            );
            userByEmail.set(user.email, user);
        }

        for (const values of baskets) {
            const user = userByEmail.get(values.userEmail);
            const basket = await upsertAndGet(
                Basket,
                { userId: user.id },
                { userId: user.id },
                transaction
            );
            basketByEmail.set(values.userEmail, basket);
        }

        for (const values of typeBrands) {
            const typeId = typeByName.get(values.type).id;
            const brandId = brandByName.get(values.brand).id;
            await TypeBrand.findOrCreate({
                where: { typeId, brandId },
                defaults: { typeId, brandId },
                transaction
            });
        }

        for (const values of devices) {
            const deviceValues = {
                name: values.name,
                price: values.price,
                rating: values.rating,
                img: values.img,
                brandId: brandByName.get(values.brand).id,
                typeId: typeByName.get(values.type).id
            };
            const device = await upsertAndGet(
                Device,
                { name: values.name },
                deviceValues,
                transaction
            );
            deviceByName.set(device.name, device);
        }

        for (const values of deviceInfos) {
            const deviceId = deviceByName.get(values.deviceName).id;
            await upsertAndGet(
                DeviceInfo,
                { deviceId, title: values.title },
                { deviceId, title: values.title, description: values.description },
                transaction
            );
        }

        for (const values of ratings) {
            const userId = userByEmail.get(values.userEmail).id;
            const deviceId = deviceByName.get(values.deviceName).id;
            await upsertAndGet(
                Rating,
                { userId, deviceId },
                { userId, deviceId, rate: values.rate },
                transaction
            );
        }

        for (const values of basketDevices) {
            const basketId = basketByEmail.get(values.userEmail).id;
            const deviceId = deviceByName.get(values.deviceName).id;
            await BasketDevice.findOrCreate({
                where: { basketId, deviceId },
                defaults: { basketId, deviceId },
                transaction
            });
        }
    });

    console.log('Seed complete: 10 types, 10 brands, 6 users, 200 devices, and related records.');
}

seed()
    .catch((error) => {
        console.error('Seed failed:', error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await sequelize.close();
    });
