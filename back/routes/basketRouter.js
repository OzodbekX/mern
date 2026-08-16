const Router = require('express')
const basketController = require('../controllers/basketController')
const authMiddleware = require('../middleware/authMiddleware')

const router = new Router()

router.use(authMiddleware)
router.get('/', basketController.get)
router.post('/', basketController.add)
router.delete('/:deviceId', basketController.remove)
router.delete('/', basketController.clear)

module.exports = router
