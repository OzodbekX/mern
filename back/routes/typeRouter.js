const Router = require("express");
const router = new Router();
const typeController = require("../controllers/typeController");
const checkRole=require("../middleware/checkRoleMiddleware")

router.get("/", typeController.getAll);
router.get("/:id", typeController.getOne);
router.post("/",checkRole("ADMIN"), typeController.create);
router.put("/:id", typeController.update);
router.delete("/:id", typeController.destroy);

module.exports = router;
