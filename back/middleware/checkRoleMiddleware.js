const jwt = require("jsonwebtoken");

// Rejects the request unless the caller holds the required role.
module.exports = (role) => (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const token = (req.headers.authorization || "").split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Not authorized" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== role) {
            return res.status(403).json({ message: "Forbidden: insufficient rights" });
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized" });
    }
};
