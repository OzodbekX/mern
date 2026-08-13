const Router = require("express");
const router = new Router();
const deviceController = require("../controllers/deviceController");

router.get("/", deviceController.getAll);
router.get("/:id", deviceController.getOne);
router.post("/", deviceController.create);
router.put("/:id", deviceController.update);
router.delete("/:id", deviceController.destroy);

module.exports = router;
