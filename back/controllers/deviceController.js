class DeviceController {
    async getAll(req, res) {
        res.status(200).json({ message: "Hello from device getAll!" });
    }

    async getOne(req, res) {
        res.status(200).json({ message: "Hello from device getOne!", id: req.params.id });
    }

    async create(req, res) {
        res.status(200).json({ message: "Hello from device create!" });
    }

    async update(req, res) {
        res.status(200).json({ message: "Hello from device update!", id: req.params.id });
    }

    async destroy(req, res) {
        res.status(200).json({ message: "Hello from device delete!", id: req.params.id });
    }
}

module.exports = new DeviceController();
