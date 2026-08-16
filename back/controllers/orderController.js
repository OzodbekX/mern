const { Order, UserCard } = require('../models/models')
const ApiError = require('../error/apiError')

const FIRST_STEP_ERRORS = [
    { status: 400, code: 'WRONG_CARD_PASSWORD', message: 'Card password is incorrect' },
    { status: 400, code: 'INVALID_EXPIRATION', message: 'Card expiration data is incorrect' }
]

const VERIFICATION_ERRORS = [
    { status: 400, code: 'WRONG_VERIFICATION_CODE', message: 'Verification code is incorrect' },
    { status: 402, code: 'INSUFFICIENT_FUNDS', message: 'Not enough amount on the card' }
]

function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)]
}

function shouldSimulateFailure() {
    return Math.random() < 0.25
}

function sendPaymentError(res, error) {
    return res.status(error.status).json({
        success: false,
        error: error.code,
        message: error.message
    })
}

function isExpired(month, year) {
    const now = new Date()
    return year < now.getFullYear()
        || (year === now.getFullYear() && month < now.getMonth() + 1)
}

class OrderController {
    async purchaseWithSavedCard(req, res, next) {
        try {
            const { items, amount, cardId } = req.body
            if (!Array.isArray(items) || items.length === 0) {
                return next(ApiError.badRequest('Order items must be a non-empty array'))
            }

            const numericAmount = Number(amount)
            if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
                return next(ApiError.badRequest('Order amount must be greater than zero'))
            }

            const numericCardId = Number(cardId)
            if (!Number.isInteger(numericCardId) || numericCardId < 1) {
                return next(ApiError.badRequest('Card ID must be a positive integer'))
            }

            const card = await UserCard.findOne({
                where: { id: numericCardId, userId: req.user.id }
            })
            if (!card) {
                return res.status(404).json({
                    success: false,
                    error: 'CARD_NOT_FOUND',
                    message: 'Saved card not found'
                })
            }
            if (isExpired(card.expiryMonth, card.expiryYear)) {
                return sendPaymentError(res, FIRST_STEP_ERRORS[1])
            }

            if (shouldSimulateFailure()) {
                return sendPaymentError(res, VERIFICATION_ERRORS[1])
            }

            const order = await Order.create({
                items,
                amount: numericAmount,
                cardLast4: card.last4,
                verificationCode: 'SAVED',
                status: 'PAID',
                userId: req.user.id
            })

            return res.status(201).json({
                success: true,
                message: 'Purchase completed successfully.',
                transactionId: order.transactionId,
                orderId: order.id,
                status: order.status,
                amount: order.amount,
                card: {
                    id: card.id,
                    brand: card.brand,
                    last4: card.last4
                }
            })
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }

    async create(req, res, next) {
        try {
            const { items, amount, card } = req.body
            if (!Array.isArray(items) || items.length === 0) {
                return next(ApiError.badRequest('Order items must be a non-empty array'))
            }

            const numericAmount = Number(amount)
            if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
                return next(ApiError.badRequest('Order amount must be greater than zero'))
            }

            if (!card || typeof card !== 'object') {
                return next(ApiError.badRequest('Card data is required'))
            }

            const cardNumber = String(card.number || '').replace(/\s|-/g, '')
            const expiryMonth = Number(card.expiryMonth)
            const expiryYear = Number(card.expiryYear)

            if (!/^\d{12,19}$/.test(cardNumber)) {
                return next(ApiError.badRequest('Card number must contain 12 to 19 digits'))
            }
            if (!card.password) {
                return next(ApiError.badRequest('Card password is required'))
            }
            if (!Number.isInteger(expiryMonth) || expiryMonth < 1 || expiryMonth > 12
                || !Number.isInteger(expiryYear)) {
                return sendPaymentError(res, FIRST_STEP_ERRORS[1])
            }
            if (isExpired(expiryMonth, expiryYear)) {
                return sendPaymentError(res, FIRST_STEP_ERRORS[1])
            }

            if (shouldSimulateFailure()) {
                return sendPaymentError(res, randomItem(FIRST_STEP_ERRORS))
            }

            const verificationCode = String(Math.floor(100000 + Math.random() * 900000))
            const order = await Order.create({
                items,
                amount: numericAmount,
                cardLast4: cardNumber.slice(-4),
                verificationCode,
                status: 'PENDING_VERIFICATION',
                userId: req.user.id
            })

            return res.status(201).json({
                success: true,
                message: 'Card accepted. Verification is required.',
                transactionId: order.transactionId,
                status: order.status,
                verificationCode
            })
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }

    async verify(req, res, next) {
        try {
            const { transactionId, verificationCode } = req.body
            if (!transactionId || !verificationCode) {
                return next(ApiError.badRequest('Transaction ID and verification code are required'))
            }

            const order = await Order.findOne({
                where: { transactionId, userId: req.user.id }
            })
            if (!order) {
                return res.status(404).json({
                    success: false,
                    error: 'ORDER_NOT_FOUND',
                    message: 'Order not found'
                })
            }
            if (order.status !== 'PENDING_VERIFICATION') {
                return res.status(409).json({
                    success: false,
                    error: 'ORDER_ALREADY_PROCESSED',
                    message: 'Order has already been processed'
                })
            }
            if (String(verificationCode) !== order.verificationCode) {
                return sendPaymentError(res, VERIFICATION_ERRORS[0])
            }

            if (shouldSimulateFailure()) {
                return sendPaymentError(res, randomItem(VERIFICATION_ERRORS))
            }

            order.status = 'PAID'
            order.verificationCode = 'USED'
            await order.save()

            return res.json({
                success: true,
                message: 'Payment verified and order accepted.',
                transactionId: order.transactionId,
                orderId: order.id,
                status: order.status,
                amount: order.amount
            })
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new OrderController()
