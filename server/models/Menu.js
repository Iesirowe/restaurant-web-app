const mongoose = require('mongoose');

// Схема для зберігання страв меню
const menuSchema = new mongoose.Schema({
  // Категорія страви
  category: {
    type: String,
    required: [true, 'Категорія обов\'язкова'],
    enum: ['Закуски', 'Супи', 'Основні страви', 'Десерти', 'Напої'],
    trim: true
  },
  // Назва страви
  name: {
    type: String,
    required: [true, 'Назва страви обов\'язкова'],
    trim: true,
    maxlength: [100, 'Назва не повинна перевищувати 100 символів']
  },
  // Ціна страви
  price: {
    type: Number,
    required: [true, 'Ціна обов\'язкова'],
    min: [0, 'Ціна не може бути від\'ємною']
  },
  // Опис страви
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Опис не повинен перевищувати 500 символів']
  },
  // Статус доступності страви
  available: {
    type: Boolean,
    default: true
  }
}, {
  // Автоматичне додавання createdAt та updatedAt
  timestamps: true
});

// Індекс для швидкого пошуку за категорією
menuSchema.index({ category: 1 });

module.exports = mongoose.model('Menu', menuSchema);
