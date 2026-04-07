const express = require('express')
const confessionController = require('../controllers/confessionController')

const router = express.Router()

router.post('/', confessionController.handleCreateConfession)
router.get('/', confessionController.handleGetAllConfessions)
router.get('/category/:cat', confessionController.handleGetConfessionsByCategory)
router.get('/:id', confessionController.handleGetConfessionById)
router.delete('/:id', confessionController.handleDeleteConfession)

module.exports = router