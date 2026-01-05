const express = require('express')
const router = express.Router()
const menuController = require('../controllers/menu.controller')

// Отримання списку страв меню
router.get('/', menuController.getAllMenu)

// Створення нової страви меню
router.post('/', menuController.createMenuItem)

module.exports = router
