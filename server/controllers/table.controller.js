const Table = require("../models/Table");
const Reservation = require("../models/Reservation");

// Отримання списку вільних столиків
exports.getAvailableTables = async (req, res) => {
  try {
    // Отримання параметрів пошуку
    const { date, time, guests } = req.query;

    // Перевірка обов’язкових параметрів
    if (!date || !time || !guests) {
      return res.status(400).json({
        success: false,
        message: "Потрібно вказати дату, час та кількість гостей"
      });
    }

    // Пошук столиків з достатньою кількістю місць
    const suitableTables = await Table.find({
      seats: { $gte: Number(guests) }
    });

    // Отримання бронювань на вказану дату та час
    const reservations = await Reservation.find({
      date: new Date(date),
      time
    });

    const reservedTableIds = reservations.map(r => r.tableId.toString());

    // Фільтрація вільних столиків
    const availableTables = suitableTables.filter(
      table => !reservedTableIds.includes(table._id.toString())
    );

    res.json({
      success: true,
      count: availableTables.length,
      data: availableTables
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Помилка отримання столиків"
    });
  }
};
