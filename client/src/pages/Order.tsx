// Імпорт компонента форми замовлення
import OrderForm from "../components/OrderForm"
// Підключення стилів сторінки замовлення
import "../styles/Order.css"

// Компонент сторінки створення замовлення
export default function Order() {
  return (
    // Основний контейнер сторінки
    <div className="order-page">
      {/* Заголовок сторінки */}
      <div className="order-header">
        <h1>Створити замовлення</h1>
        <p>Оберіть страви та оформіть замовлення онлайн</p>
      </div>

      {/* Форма оформлення замовлення */}
      <OrderForm />
    </div>
  )
}
