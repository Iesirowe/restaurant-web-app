const express = require('express')
const router = express.Router()
const orderController = require('../controllers/order.controller')

// Створення нового замовлення
router.post('/', orderController.createOrder)

// Отримання списку всіх замовлень
router.get('/s', orderController.getAllOrders)

// Отримання замовлення за ідентифікатором
router.get('/:id', orderController.getOrderById)

// Оновлення статусу замовлення
router.patch('/:id/status', orderController.updateOrderStatus)

module.exports = router
