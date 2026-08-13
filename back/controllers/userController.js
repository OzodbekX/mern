const ApiError = require("../error/apiError");

class UserController {
    async registration(req, res) {
        res.status(200).json({ message: "Hello from user registration!" });
    }

    async login(req, res) {
        res.status(200).json({ message: "Hello from user login!" });
    }

    async check(req, res, next) {
        const {id} = req.query;
        if (!id) {
            return next(ApiError.badRequest("User ID is required"));
        }
        return res.status(200).json({ message: "Hello from user auth check! "+id });
    }
}

module.exports = new UserController();
