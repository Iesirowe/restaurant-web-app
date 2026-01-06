const mongoose = require('mongoose')
const Table = require('./models/Table')
const Menu = require('./models/Menu')
const Reservation = require('./models/Reservation')

// Підключення до бази даних MongoDB
mongoose.connect('mongodb+srv://user:1234@restaraunt.6pse0pj.mongodb.net/?appName=Restaraunt', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB підключено'))
.catch(err => console.error('Помилка підключення:', err))

// Початкові дані для столиків
const tables = [
  { number: 1, seats: 2 },
  { number: 2, seats: 2 },
  { number: 3, seats: 4 },
  { number: 4, seats: 4 },
  { number: 5, seats: 6 },
  { number: 6, seats: 8 },
  { number: 7, seats: 10 }
]

// Початкові дані для меню
const menuItems = [
  { category: 'Закуски', name: 'Брускетта з томатами', price: 120, description: 'Хрусткий хліб з помідорами та базиліком' },
  { category: 'Закуски', name: 'Сирна тарілка', price: 280, description: 'Асорті з європейських сирів' },
  { category: 'Закуски', name: 'Карпаччо з яловичини', price: 350, description: 'Тонко нарізана яловичина з рукколою' },
  
  { category: 'Супи', name: 'Борщ український', price: 150, description: 'Традиційний борщ зі сметаною' },
  { category: 'Супи', name: 'Крем-суп з грибів', price: 180, description: 'Ніжний суп з лісових грибів' },
  
  { category: 'Основні страви', name: 'Стейк Рібай', price: 650, description: 'Мармурова яловичина 250г' },
  { category: 'Основні страви', name: 'Лосось на грилі', price: 480, description: 'Філе лосося з овочами' },
  { category: 'Основні страви', name: 'Паста Карбонара', price: 320, description: 'Класична паста з беконом' },
  { category: 'Основні страви', name: 'Курка по-київськи', price: 280, description: 'Котлета з маслом і зеленню' },
  
  { category: 'Десерти', name: 'Тірамісу', price: 180, description: 'Класичний італійський десерт' },
  { category: 'Десерти', name: 'Чізкейк Нью-Йорк', price: 200, description: 'Ніжний сирний торт' },
  { category: 'Десерти', name: 'Штрудель яблучний', price: 150, description: 'Теплий штрудель з морозивом' },
  
  { category: 'Напої', name: 'Еспресо', price: 60, description: 'Класична італійська кава' },
  { category: 'Напої', name: 'Капучіно', price: 80, description: 'Кава з молочною пінкою' },
  { category: 'Напої', name: 'Свіжовичавлений апельсиновий сік', price: 120, description: '250мл' },
  { category: 'Напої', name: 'Лимонад домашній', price: 90, description: 'Освіжаючий лимонад' }
]

// Функція початкового заповнення бази даних
const seedDatabase = async () => {
  try {
    // Очищення існуючих даних
    await Reservation.deleteMany({})
    await Table.deleteMany({})
    await Menu.deleteMany({})
    console.log('Старі дані видалено')

    // Додавання столиків
    const createdTables = await Table.insertMany(tables)
    console.log(`Додано столиків: ${createdTables.length}`)

    // Додавання меню
    await Menu.insertMany(menuItems)
    console.log(`Додано страв: ${menuItems.length}`)
    
    // Формування тестових дат
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const dayAfterTomorrow = new Date(today)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

    // Тестові бронювання
    const reservations = [
      {
        date: tomorrow,
        time: '18:00',
        guests: 2,
        tableId: createdTables[0]._id,
        name: 'Олександр Бондаренко',
        phone: '+380501112233',
        status: 'confirmed'
      },
      {
        date: tomorrow,
        time: '19:30',
        guests: 4,
        tableId: createdTables[2]._id,
        name: 'Марія Коваль',
        phone: '+380679998877',
        status: 'pending'
      },
      {
        date: dayAfterTomorrow,
        time: '20:00',
        guests: 6,
        tableId: createdTables[4]._id,
        name: 'Дмитро Шевченко',
        phone: '+380635554433',
        status: 'confirmed'
      }
    ]

    // Додавання бронювань
    await Reservation.insertMany(reservations)
    console.log(`Додано резервацій: ${reservations.length}`)

    console.log('База даних успішно заповнена тестовими даними!')
    process.exit(0)
  } catch (error) {
    console.error('Помилка при заповненні БД:', error)
    process.exit(1)
  }
}

// Запуск ініціалізації бази даних
seedDatabase()
