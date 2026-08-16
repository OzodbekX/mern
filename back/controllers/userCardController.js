const sequelize = require('../db')
const { UserCard } = require('../models/models')
const ApiError = require('../error/apiError')

function parseCardId(value) {
    const id = Number(value)
    return Number.isInteger(id) && id > 0 ? id : null
}

function validateCard(values, partial = false) {
    const required = ['holderName', 'brand', 'last4', 'expiryMonth', 'expiryYear']
    if (!partial && required.some((field) => values[field] === undefined)) {
        return 'Holder name, brand, last4, expiry month, and expiry year are required'
    }
    if (values.holderName !== undefined && !String(values.holderName).trim()) {
        return 'Holder name is required'
    }
    if (values.brand !== undefined && !String(values.brand).trim()) {
        return 'Card brand is required'
    }
    if (values.last4 !== undefined && !/^\d{4}$/.test(String(values.last4))) {
        return 'Last4 must contain exactly four digits'
    }
    if (values.expiryMonth !== undefined) {
        const month = Number(values.expiryMonth)
        if (!Number.isInteger(month) || month < 1 || month > 12) {
            return 'Expiry month must be an integer from 1 to 12'
        }
    }
    if (values.expiryYear !== undefined) {
        const year = Number(values.expiryYear)
        if (!Number.isInteger(year) || year < new Date().getFullYear()) {
            return 'Expiry year cannot be in the past'
        }
    }
    return null
}

function normalizeCard(values) {
    const normalized = {}
    if (values.holderName !== undefined) normalized.holderName = String(values.holderName).trim()
    if (values.brand !== undefined) normalized.brand = String(values.brand).trim()
    if (values.last4 !== undefined) normalized.last4 = String(values.last4)
    if (values.expiryMonth !== undefined) normalized.expiryMonth = Number(values.expiryMonth)
    if (values.expiryYear !== undefined) normalized.expiryYear = Number(values.expiryYear)
    if (values.isDefault !== undefined) normalized.isDefault = values.isDefault === true
    return normalized
}

class UserCardController {
    async getAll(req, res, next) {
        try {
            const cards = await UserCard.findAll({
                where: { userId: req.user.id },
                order: [['isDefault', 'DESC'], ['id', 'ASC']]
            })
            return res.json(cards)
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }

    async getOne(req, res, next) {
        try {
            const id = parseCardId(req.params.id)
            if (!id) return next(ApiError.badRequest('Card ID must be a positive integer'))

            const card = await UserCard.findOne({ where: { id, userId: req.user.id } })
            if (!card) return res.status(404).json({ message: 'Card not found' })
            return res.json(card)
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }

    async create(req, res, next) {
        const validationError = validateCard(req.body)
        if (validationError) return next(ApiError.badRequest(validationError))

        try {
            const card = await sequelize.transaction(async (transaction) => {
                const values = normalizeCard(req.body)
                const existingCards = await UserCard.count({
                    where: { userId: req.user.id },
                    transaction
                })
                values.isDefault = existingCards === 0 || values.isDefault === true

                if (values.isDefault) {
                    await UserCard.update(
                        { isDefault: false },
                        { where: { userId: req.user.id }, transaction }
                    )
                }

                return UserCard.create({ ...values, userId: req.user.id }, { transaction })
            })
            return res.status(201).json(card)
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }

    async update(req, res, next) {
        const id = parseCardId(req.params.id)
        if (!id) return next(ApiError.badRequest('Card ID must be a positive integer'))

        const validationError = validateCard(req.body, true)
        if (validationError) return next(ApiError.badRequest(validationError))

        try {
            const card = await sequelize.transaction(async (transaction) => {
                const existing = await UserCard.findOne({
                    where: { id, userId: req.user.id },
                    transaction
                })
                if (!existing) return null

                const values = normalizeCard(req.body)
                if (values.isDefault) {
                    await UserCard.update(
                        { isDefault: false },
                        { where: { userId: req.user.id }, transaction }
                    )
                }
                return existing.update(values, { transaction })
            })

            if (!card) return res.status(404).json({ message: 'Card not found' })
            return res.json(card)
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }

    async destroy(req, res, next) {
        try {
            const id = parseCardId(req.params.id)
            if (!id) return next(ApiError.badRequest('Card ID must be a positive integer'))

            const deleted = await UserCard.destroy({ where: { id, userId: req.user.id } })
            if (!deleted) return res.status(404).json({ message: 'Card not found' })
            return res.json({ message: 'Card deleted successfully!' })
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new UserCardController()
