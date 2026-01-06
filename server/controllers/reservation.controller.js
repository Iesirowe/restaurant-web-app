const Reservation = require('../models/Reservation');
const Table = require('../models/Table');

// Створення нового бронювання
exports.createReservation = async (req, res) => {
  try {
    // Отримання даних із тіла запиту
    const { date, time, guests, name, phone } = req.body;

    // Перевірка обов’язкових полів
    if (!date || !time || !guests || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Всі поля обов\'язкові для заповнення'
      });
    }

    // Перевірка допустимої кількості гостей
    if (guests < 1 || guests > 20) {
      return res.status(400).json({
        success: false,
        message: 'Кількість гостей має бути від 1 до 20'
      });
    }

    // Нормалізація дати бронювання
    const reservationDate = new Date(date);
    reservationDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Заборона бронювання на минулу дату
    if (reservationDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Не можна забронювати столик на минулу дату'
      });
    }

    // Пошук зайнятих столиків означений час
    const existingReservations = await Reservation.find({
      date: reservationDate,
      time: time,
      status: { $in: ['pending', 'confirmed'] }
    }).select('tableId');

    const occupiedTableIds = existingReservations.map(r => r.tableId.toString());

    // Пошук найменшого вільного столика з достатньою кількістю місць
    const availableTable = await Table.findOne({
      _id: { $nin: occupiedTableIds }, 
      seats: { $gte: guests }
    }).sort({ seats: 1 }); 

    if (!availableTable) {
      return res.status(409).json({
        success: false,
        message: 'На жаль, немає вільних столиків на обраний час',
        suggestion: 'Спробуйте обрати інший час або дату'
      });
    }

    // Створення бронювання в базі даних
    const reservation = await Reservation.create({
      date: reservationDate,
      time,
      guests,
      tableId: availableTable._id,
      name,
      phone,
      status: 'pending'
    });

    // Отримання бронювання з інформацією про столик
    const populatedReservation = await Reservation.findById(reservation._id)
      .populate('tableId', 'number seats');

    res.status(201).json({
      success: true,
      message: 'Бронювання успішно створено',
      data: populatedReservation
    });

  } catch (error) {
    console.error('Помилка при створенні бронювання:', error);
    
    // Обробка помилок валідації
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Помилка валідації даних',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Помилка сервера при створенні бронювання',
      error: error.message
    });
  }
};

// Отримання списку бронювань
exports.getAllReservations = async (req, res) => {
  try {
    const { date, status } = req.query;

    const filter = {};
    
    // Фільтрація за датою
    if (date) {
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      filter.date = searchDate;
    }
    
    // Фільтрація за статусом
    if (status) {
      filter.status = status;
    }

    const reservations = await Reservation.find(filter)
      .populate('tableId', 'number seats')
      .sort({ date: 1, time: 1 });

    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    console.error('Помилка при отриманні бронювань:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка при отриманні бронювань',
      error: error.message
    });
  }
};

// Скасування бронювання
exports.cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    // Оновлення статусу бронювання
    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    ).populate('tableId', 'number seats');

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Бронювання не знайдено'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Бронювання скасовано',
      data: reservation
    });
  } catch (error) {
    console.error('Помилка при скасуванні бронювання:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка при скасуванні бронювання',
      error: error.message
    });
  }
};
