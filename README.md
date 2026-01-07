# Restaurant Web Application

Клієнт-серверний веб-застосунок для онлайн-замовлень та бронювання столиків у ресторані.  
Проєкт виконано в межах курсової роботи.

## Технології
- **Frontend:** React + TypeScript
- **Backend:** Node.js + Express
- **Database:** MongoDB + Mongoose (MongoDB Atlas)

## Структура репозиторію
repo/
client/ # клієнтська частина (React + TypeScript)
server/ # серверна частина (Node.js + Express API)
README.md

## Запуск проєкту локально

### Вимоги
- Node.js **>= 18**
- npm
- Обліковий запис **MongoDB Atlas** або локальний MongoDB

### Налаштування змінних середовища

Для запуску проєкту необхідно використовувати **хмарну базу даних MongoDB Atlas**.  
Користувач повинен створити власний кластер та вказати рядок підключення у файлі `.env`.

#### server/.env.example

PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/restaurant_db
NODE_ENV=development
Реальні значення змінних середовища не додаються до репозиторію з міркувань безпеки.

Backend

cd server
copy .env.example .env     # Windows
або
cp .env.example .env       # Linux / macOS

npm install

npm run dev

Backend API буде доступний за адресою:

http://localhost:5000

Frontend

cd client 

npm install

npm run dev

Frontend буде доступний за адресою:

http://localhost:5173

Тестові дані
Для перевірки працездатності системи використовується seed-скрипт, який заповнює
базу даних тестовими даними (столики, меню, бронювання).

cd server
node seed.js
Також тестові дані можуть створюватися безпосередньо через веб-інтерфейс застосунку
(оформлення бронювання та онлайн-замовлення).

### Основні API-ендпоїнти
POST /api/reservation — створення бронювання

PATCH /api/reservation/:id/cancel — скасування бронювання

POST /api/order — створення замовлення

PATCH /api/order/:id/status — зміна статусу замовлення

GET /api/menu — отримання меню

### Тестування
Тестування виконувалося з використанням MongoDB Atlas та включає:

перевірку створення бронювань;

оформлення онлайн-замовлень;

зміну статусів замовлень та скасування бронювань через адміністративну панель.

Результати тестування наведено у вигляді скріншотів та відеопрезентації.

### Відеопрезентація 
Посилання: https://youtu.be/-d0BPMJFUgY?si=4PXHTFn9oyA61Kf8


Автор
Піндюр Руслан Р.
Група: ZAI-221
06.01.2026
