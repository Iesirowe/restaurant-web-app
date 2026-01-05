const express = require('express')
const router = express.Router()

// Підключення контролера для роботи з бронюваннями
const reservationController = require('../controllers/reservation.controller')

// Створення нового бронювання
router.post('/', reservationController.createReservation)

// Отримання списку всіх бронювань
router.get('/s', reservationController.getAllReservations)

// Скасування бронювання за ідентифікатором
router.patch('/:id/cancel', reservationController.cancelReservation)

module.exports = router
