const { Type } = require("../models/models");
const ApiError = require("../error/apiError");
class TypeController {
    async getAll(req, res) {
        const types = await Type.findAll();
        console.log("Types retrieved:", types);
        return res.status(200).json(types);
    }

    async getOne(req, res) {
        const type = await Type.findByPk(req.params.id);
        if (!type) {
            return res.status(404).json({ message: "Type not found" });
        }
        return res.status(200).json(type);
    }

    async create(req, res) {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Type name is required" });
        }
        const type = await Type.create({ name });
        return res.status(201).json({ message: "Type created successfully!", type });
    }

    async update(req, res) {
        res.status(200).json({ message: "Hello from type update!", id: req.params.id });
    }

    async destroy(req, res) {
        res.status(200).json({ message: "Hello from type delete!", id: req.params.id });
    }
}

module.exports = new TypeController();
