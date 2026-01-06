const mongoose = require('mongoose');

// Схема для зберігання бронювань столиків
const reservationSchema = new mongoose.Schema({
  // Дата бронювання
  date: {
    type: Date,
    required: [true, 'Дата обов\'язкова'],
    validate: {
      validator: function(value) {
        // Перевірка, що дата не в минулому
        return value >= new Date().setHours(0, 0, 0, 0);
      },
      message: 'Дата не може бути в минулому'
    }
  },
  // Час бронювання у форматі HH:MM
  time: {
    type: String,
    required: [true, 'Час обов\'язковий'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Невірний формат часу (HH:MM)']
  },
  // Кількість гостей
  guests: {
    type: Number,
    required: [true, 'Кількість гостей обов\'язкова'],
    min: [1, 'Мінімум 1 гість'],
    max: [20, 'Максимум 20 гостей']
  },
  // Посилання на заброньований столик
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: [true, 'ID столика обов\'язковий']
  },
  // Ім’я клієнта
  name: {
    type: String,
    required: [true, 'Ім\'я обов\'язкове'],
    trim: true,
    minlength: [2, 'Ім\'я має містити мінімум 2 символи'],
    maxlength: [100, 'Ім\'я не повинно перевищувати 100 символів']
  },
  // Контактний номер телефону
  phone: {
    type: String,
    required: [true, 'Телефон обов\'язковий'],
    match: [/^[\d\s\+\-\(\)]+$/, 'Невірний формат телефону']
  },
  // Статус бронювання
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  }
}, {
  // Автоматичне додавання createdAt та updatedAt
  timestamps: true
});

// Індекс для пошуку бронювань за датою та часом
reservationSchema.index({ date: 1, time: 1 });

// Індекс для швидкого пошуку бронювань за столиком
reservationSchema.index({ tableId: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
