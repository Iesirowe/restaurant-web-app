// Імпорт хуків React
import { useState, useEffect } from "react"
// API-клієнт для запитів до бекенду
import api from "../api/api"
// Типи даних для адмін-панелі
import type { Reservation, Order, MenuItem } from "../types/types"
// Підключення стилів адмін-сторінки
import "../styles/Admin.css"

// Компонент адміністративної панелі
export default function Admin() {
  // Стани для бронювань, замовлень та меню
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  // Активна вкладка адмін-панелі
  const [activeTab, setActiveTab] =
    useState<"reservations" | "orders">("reservations")
  const [loading, setLoading] = useState(true)

  // Завантаження даних при першому рендері
  useEffect(() => {
    fetchData()
  }, [])

  // Отримання бронювань, замовлень та меню
  const fetchData = async () => {
    try {
      setLoading(true)

      const [resResponse, ordersResponse, menuResponse] =
        await Promise.all([
          api.get("/api/reservation/s"),
          api.get("/api/order/s"),
          api.get("/api/menu"),
        ])

      setReservations(resResponse.data.data)
      setOrders(ordersResponse.data.data)
      setMenuItems(menuResponse.data.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Отримання назви страви за її ID
  const getMenuItemName = (menuItemId: string): string => {
    const item = menuItems.find((m) => m._id === menuItemId)
    return item?.name || "Невідома страва"
  }

  // Форматування дати
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uk-UA")
  }

  // Форматування дати та часу
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("uk-UA")
  }

  // Відображення індикатора завантаження
  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Завантаження даних...</div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      {/* Заголовок адмін-панелі */}
      <div className="admin-header">
        <h1>Адміністративна панель</h1>
        <button onClick={fetchData} className="refresh-btn">
          🔄 Оновити дані
        </button>
      </div>

      {/* Перемикач вкладок */}
      <div className="admin-tabs">
        <button
          className={`tab-btn ${
            activeTab === "reservations" ? "active" : ""
          }`}
          onClick={() => setActiveTab("reservations")}
        >
          Бронювання ({reservations.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Замовлення ({orders.length})
        </button>
      </div>

      {/* Вкладка бронювань */}
      {activeTab === "reservations" && (
        <div className="admin-content">
          <h2>Список бронювань</h2>
          {reservations.length === 0 ? (
            <p className="empty-message">Немає бронювань</p>
          ) : (
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Час</th>
                    <th>Ім'я</th>
                    <th>Телефон</th>
                    <th>Гостей</th>
                    <th>Столик</th>
                    <th>Створено</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation._id}>
                      <td>{formatDate(reservation.date)}</td>
                      <td>{reservation.time}</td>
                      <td>{reservation.name}</td>
                      <td>{reservation.phone}</td>
                      <td>{reservation.guests}</td>
                      <td>
                        {reservation.tableId
                          ? `№${reservation.tableId.number} (${reservation.tableId.seats} місць)`
                          : "—"}
                      </td>
                      <td>
                        {reservation.createdAt
                          ? formatDateTime(reservation.createdAt)
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Вкладка замовлень */}
      {activeTab === "orders" && (
        <div className="admin-content">
          <h2>Список замовлень</h2>
          {orders.length === 0 ? (
            <p className="empty-message">Немає замовлень</p>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-card-header">
                    <div>
                      <strong>{order.name}</strong>
                      <p>{order.phone}</p>
                    </div>
                    <div className="order-status">
                      <span
                        className={`status-badge ${order.status}`}
                      >
                        {order.status || "новий"}
                      </span>
                      <span className="order-total">
                        {order.totalAmount} ₴
                      </span>
                    </div>
                  </div>

                  {/* Список страв у замовленні */}
                  <div className="order-items-list">
                    <h4>Страви:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item-row">
                        <span>
                          {getMenuItemName(item.menuItemId)}
                        </span>
                        <span>× {item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Дата створення замовлення */}
                  {order.createdAt && (
                    <div className="order-date">
                      Створено: {formatDateTime(order.createdAt)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
