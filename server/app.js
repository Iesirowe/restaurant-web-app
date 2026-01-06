require("dotenv").config()
const express = require('express');
const cors = require('cors');
const connectDB = require("./config/db")

const menuRoutes = require('./routes/menu.routes');
const reservationRoutes = require('./routes/reservation.routes');
const orderRoutes = require('./routes/order.routes');
const tableRoutes = require('./routes/table.routes')
const app = express();

connectDB();

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/api/menu', menuRoutes);
app.use('/api/reservation', reservationRoutes);
app.use('/api/order', orderRoutes);
app.use("/api/tables", tableRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Restaurant Booking API', 
    version: '1.0.0' 
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Внутрішня помилка сервера',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Маршрут не знайдено'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server запущено на порту ${PORT}`);
});