const Order = require('../models/Order');
const Menu = require('../models/Menu');

// Створення нового замовлення
exports.createOrder = async (req, res) => {
  try {
    // Отримання даних із запиту
    const { name, phone, items, comment } = req.body;

    // Перевірка обов’язкових даних клієнта
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Ім\'я та телефон обов\'язкові'
      });
    }

    // Перевірка наявності страв у замовленні
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Додайте хоча б одну страву до замовлення'
      });
    }

    let totalAmount = 0;
    const validatedItems = [];

    // Перевірка кожної страви з меню та підрахунок суми
    for (const item of items) {
      const menuItem = await Menu.findById(item.menuItemId);
      
      if (!menuItem) {
        return res.status(400).json({
          success: false,
          message: `Страву з ID ${item.menuItemId} не знайдено в меню`
        });
      }

      // Перевірка доступності страви
      if (!menuItem.available) {
        return res.status(400).json({
          success: false,
          message: `Страва "${menuItem.name}" зараз недоступна`
        });
      }

      const quantity = item.quantity || 1;
      const itemTotal = menuItem.price * quantity;
      
      // Формування списку валідованих позицій
      validatedItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: quantity
      });

      totalAmount += itemTotal;
    }

    // Створення замовлення в базі даних
    const order = await Order.create({
      name,
      phone,
      items: validatedItems,
      comment: comment || '',
      totalAmount,
      status: 'pending'
    });

    // Успішна відповідь
    res.status(201).json({
      success: true,
      message: 'Замовлення успішно створено',
      data: order
    });

  } catch (error) {
    console.error('Помилка при створенні замовлення:', error);
    
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
      message: 'Помилка сервера при створенні замовлення',
      error: error.message
    });
  }
};

// Отримання списку замовлень
exports.getAllOrders = async (req, res) => {
  try {
    const { status, limit = 50 } = req.query;

    // Формування фільтра за статусом
    const filter = {};
    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Помилка при отриманні замовлень:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка при отриманні замовлень',
      error: error.message
    });
  }
};

// Отримання замовлення за ідентифікатором
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Замовлення не знайдено'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Помилка при отриманні замовлення:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка при отриманні замовлення',
      error: error.message
    });
  }
};

// Оновлення статусу замовлення
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Перелік дозволених статусів
    const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Недопустимий статус замовлення'
      });
    }

    // Оновлення статусу в базі даних
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Замовлення не знайдено'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Статус замовлення оновлено',
      data: order
    });
  } catch (error) {
    console.error('Помилка при оновленні статусу замовлення:', error);
    res.status(500).json({
      success: false,
      message: 'Помилка при оновленні статусу замовлення',
      error: error.message
    });
  }
};
