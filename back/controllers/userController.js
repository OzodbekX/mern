const ApiError = require("../error/apiError");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Basket } = require('../models/models')
const generateJWT = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    )
}
class UserController {
    async registration(req, res, next) {
        const { email, password, role } = req.body
        if (!email || !password) {
            return next(ApiError.badRequest("Wrong passrod or login"))
        }
        const candidate = await User.findOne({ where: { email } })
        if (candidate) {
            return next(ApiError.badRequest('User this this email is already exists'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({ email, role, password: hashPassword })
        const basket = await Basket.create({ userId: user.id })
        const token = generateJWT(user.id, user.email, user.role)
        return res.json({ token });
    }

    async login(req, res, next) {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return next(ApiError.internal("User not fount"))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        if (!password) {
            return next(ApiError.internal("User not fount"))
        }
        return res.json({ token: generateJWT(user.id, user.email, user.role) })
    }

    async check(req, res, next) {
        try {
            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ['password'] }
            })
            if (!user) {
                return res.status(404).json({ message: 'User not found' })
            }

            const token = generateJWT(user.id, user.email, user.role)
            return res.json({ token, user })
        } catch (error) {
            return next(ApiError.badRequest(error.message))
        }
    }
}

module.exports = new UserController();
