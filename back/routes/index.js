const Router = require("express");
const router = new Router();

const userRouter = require("./userRouter");
const typeRouter = require("./typeRouter");
const brandRouter = require("./brandRouter");
const deviceRouter = require("./deviceRouter");
const basketRouter = require("./basketRouter");
const userCardRouter = require("./userCardRouter");
const orderRouter = require("./orderRouter");

router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/brand', brandRouter);
router.use('/device', deviceRouter);
router.use('/basket', basketRouter);
router.use('/card', userCardRouter);
router.use('/order', orderRouter);

module.exports = router;
