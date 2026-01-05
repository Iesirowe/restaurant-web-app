const mongoose = require('mongoose');

// Схема для зберігання інформації про столики
const tableSchema = new mongoose.Schema({
  // Номер столика
  number: {
    type: Number,
    required: [true, 'Номер столика обов\'язковий'],
    unique: true,
    min: [1, 'Номер столика має бути додатним']
  },
  // Кількість місць за столиком
  seats: {
    type: Number,
    required: [true, 'Кількість місць обов\'язкова'],
    min: [1, 'Кількість місць має бути додатною'],
    max: [20, 'Максимум 20 місць']
  }
}, {
  // Автоматичне додавання дат створення та оновлення
  timestamps: true
});

module.exports = mongoose.model('Table', tableSchema);
