const Router = require("express");
const router = new Router();
const brandController = require("../controllers/brandController");

router.get("/", brandController.getAll);
router.get("/:id", brandController.getOne);
router.post("/", brandController.create);
router.put("/:id", brandController.update);
router.delete("/:id", brandController.destroy);

module.exports = router;
