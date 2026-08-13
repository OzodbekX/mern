const { Type } = require("../models/models");
const ApiError = require("../error/apiError");
class TypeController {
    async getAll(req, res) {
        const types = await Type.findAll();
        return res.status(200).json(types); 
        res.status(200).json({ message: "Hello from type getAll!" });
    }

    async getOne(req, res) {
        res.status(200).json({ message: "Hello from type getOne!", id: req.params.id });
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
