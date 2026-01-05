const express = require("express");
const router = express.Router();

// Підключення контролера для роботи зі столиками
const tableController = require("../controllers/table.controller");

// Отримання списку доступних столиків
router.get("/available", tableController.getAvailableTables);

module.exports = router;
