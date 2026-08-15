const { Brand } = require("../models/models");

class BrandController {
    async getAll(req, res) {
        const brands = await Brand.findAll();
        return res.status(200).json(brands);
    }

    async getOne(req, res) {
        const brand = await Brand.findByPk(req.params.id);
        return res.status(200).json(brand);
    }

    async create(req, res) {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Brand name is required" });
        }

        try {
            const brand = await Brand.create({ name });
            return res.status(201).json({ message: "Brand created successfully!", brand });
        } catch (error) {
            if (error.name === 'SequelizeUniqueConstraintError') {
                return res.status(409).json({ message: "A brand with this name already exists" });
            }

            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    async update(req, res) {
        const { name } = req.body;
        const brand = await Brand.findByPk(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }
        await brand.update({ name });
        return res.status(200).json({ message: "Brand updated successfully!", brand });
    }

    async destroy(req, res) {
        const brand = await Brand.findByPk(req.params.id);
        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }
        await brand.destroy();
        return res.status(200).json({ message: "Brand deleted successfully!" });
    }
}

module.exports = new BrandController();
