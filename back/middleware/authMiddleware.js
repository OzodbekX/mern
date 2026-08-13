const jwt = require("jsonwebtoken");

// Rejects the request unless a valid Bearer token is present.
module.exports = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const token = (req.headers.authorization || "").split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Not authorized" });
        }
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized" });
    }
};
