const mongoose = require('mongoose');

// Схема для зберігання замовлень
const orderSchema = new mongoose.Schema({
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
  // Перелік замовлених страв
  items: [{
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Menu'
    },
    name: String,
    price: Number,
    quantity: {
      type: Number,
      min: 1,
      default: 1
    }
  }],
  // Коментар до замовлення
  comment: {
    type: String,
    trim: true,
    maxlength: [500, 'Коментар не повинен перевищувати 500 символів']
  },
  // Загальна сума замовлення
  totalAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  // Поточний статус замовлення
  status: {
    type: String,
      enum: [
      'pending',
      'in_progress',
      'ready',
      'completed',
      'cancelled'
    ],
    default: 'pending'
  },
  // Дата створення замовлення
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Автоматичне додавання дат створення та оновлення
  timestamps: true
});

// Індекс для швидкого сортування за датою створення
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
