const Router = require('express')
const orderController = require('../controllers/orderController')
const authMiddleware = require('../middleware/authMiddleware')

const router = new Router()

router.use(authMiddleware)
router.post('/', orderController.create)
router.post('/saved-card', orderController.purchaseWithSavedCard)
router.post('/verify', orderController.verify)

module.exports = router
