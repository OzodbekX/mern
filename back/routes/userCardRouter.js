const Router = require('express')
const userCardController = require('../controllers/userCardController')
const authMiddleware = require('../middleware/authMiddleware')

const router = new Router()

router.use(authMiddleware)
router.get('/', userCardController.getAll)
router.get('/:id', userCardController.getOne)
router.post('/', userCardController.create)
router.put('/:id', userCardController.update)
router.delete('/:id', userCardController.destroy)

module.exports = router
