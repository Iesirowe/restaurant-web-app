const Menu = require('../models/Menu');

// Отримання всіх доступних страв меню
exports.getAllMenu = async (req, res) => {
  try {
    // Отримання параметра категорії з query
    const { category } = req.query;

    // Формування фільтра для запиту
    const filter = {};
    if (category) {
      filter.category = category;
    }

    // Показуємо тільки доступні страви
    filter.available = true;

    // Пошук страв у базі даних з сортуванням
    const menuItems = await Menu.find(filter).sort({ category: 1, name: 1 });

    // Успішна відповідь
    res.status(200).json({
      success: true,
      count: menuItems.length,
      data: menuItems
    });
  } catch (error) {
    // Обробка помилки під час отримання меню
    console.error('Помилка при отриманні меню:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка при отриманні меню',
      error: error.message
    });
  }
};

// Створення нової страви меню
exports.createMenuItem = async (req, res) => {
  try {
    // Отримання даних із тіла запиту
    const { category, name, price, description } = req.body;

    // Перевірка обов’язкових полів
    if (!category || !name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Заповніть усі обов\'язкові поля'
      });
    }

    // Додавання нової страви до бази даних
    const menuItem = await Menu.create({
      category,
      name,
      price,
      description
    });

    // Відповідь про успішне створення
    res.status(201).json({
      success: true,
      message: 'Страву успішно додано',
      data: menuItem
    });
  } catch (error) {
    // Обробка помилки під час створення страви
    console.error('Помилка при створенні страви:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка при створенні страви',
      error: error.message
    });
  }
};
