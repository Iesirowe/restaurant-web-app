const mongoose = require('mongoose');
require('dotenv').config();

// Функція для підключення до бази даних MongoDB
const connectDB = async () => {
  try {
    // Підключення до MongoDB з використанням змінної середовища
    const conn = await mongoose.connect(
      process.env.MONGODB_URI,
      {
        useNewUrlParser: true,      // Використання нового парсера URL
        useUnifiedTopology: true,   // Увімкнення нового механізму керування з’єднанням
      }
    );

    // Повідомлення про успішне підключення
    console.log(`MongoDB підключено: ${conn.connection.host}`);
  } catch (error) {
    // Обробка помилки підключення
    console.error(`Помилка підключення до MongoDB: ${error.message}`);
    process.exit(1); // Завершення процесу у разі критичної помилки
  }
};

module.exports = connectDB;
