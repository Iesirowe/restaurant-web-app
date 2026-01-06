// Імпорт хуків React
import { useState, useEffect } from "react"
// API-клієнт для запитів до бекенду
import api from "../api/api"
// Типи даних для адмін-панелі
import type { Reservation, Order, MenuItem } from "../types/types"
// Підключення стилів адмін-сторінки
import "../styles/Admin.css"

export default function Admin() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [activeTab, setActiveTab] =
    useState<"reservations" | "orders">("reservations")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [resRes, ordRes, menuRes] = await Promise.all([
        api.get("/api/reservation/s"),
        api.get("/api/order/s"),
        api.get("/api/menu"),
      ])

      setReservations(resRes.data.data)
      setOrders(ordRes.data.data)
      setMenuItems(menuRes.data.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  // ===== СКАСУВАННЯ БРОНЮВАННЯ =====
  const cancelReservation = async (id: string) => {
    if (!window.confirm("Скасувати це бронювання?")) return

    try {
      await api.patch(`/api/reservation/${id}/cancel`)
      fetchData()
    } catch (error) {
      console.error("Помилка скасування бронювання", error)
      alert("Не вдалося скасувати бронювання")
    }
  }

  // ===== ЗМІНА СТАТУСУ ЗАМОВЛЕННЯ =====
  const updateOrderStatus = async (
    orderId: string,
    status: Order["status"]
  ) => {
    try {
      await api.patch(`/api/order/${orderId}/status`, { status })
      fetchData()
    } catch (error) {
      console.error("Помилка оновлення статусу", error)
      alert("Не вдалося змінити статус замовлення")
    }
  }

  const getMenuItemName = (menuItemId: string) => {
    const item = menuItems.find((m) => m._id === menuItemId)
    return item?.name || "Невідома страва"
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("uk-UA")

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString("uk-UA")

  if (loading) {
    return (
      <div className="admin-page">
        <div className="loading">Завантаження даних...</div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Адміністративна панель</h1>
        <button onClick={fetchData} className="refresh-btn">
          🔄 Оновити дані
        </button>
      </div>

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

      {/* ===== БРОНЮВАННЯ ===== */}
      {activeTab === "reservations" && (
        <div className="admin-content">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Дата</th>
                <th>Час</th>
                <th>Імʼя</th>
                <th>Телефон</th>
                <th>Гостей</th>
                <th>Столик</th>
                <th>Статус</th>
                <th>Дія</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r._id}>
                  <td>{formatDate(r.date)}</td>
                  <td>{r.time}</td>
                  <td>{r.name}</td>
                  <td>{r.phone}</td>
                  <td>{r.guests}</td>
                  <td>
                    {r.tableId
                      ? `№${r.tableId.number} (${r.tableId.seats})`
                      : "—"}
                  </td>
                  <td>{r.status}</td>
                  <td>
                    {r.status !== "cancelled" ? (
                      <button
                        className="danger"
                        onClick={() => cancelReservation(r._id)}
                      >
                        Скасувати
                      </button>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== ЗАМОВЛЕННЯ ===== */}
      {activeTab === "orders" && (
        <div className="admin-content orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card-header">
                <div>
                  <strong>{order.name}</strong>
                  <p>{order.phone}</p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${order.status}`}>
                    {order.status}
                  </span>
                  <span className="order-total">
                    {order.totalAmount} ₴
                  </span>
                </div>
              </div>

              <div className="order-items-list">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item-row">
                    <span>{getMenuItemName(item.menuItemId)}</span>
                    <span>× {item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="order-actions">
                {order.status === "pending" && (
                  <button
                    onClick={() =>
                      updateOrderStatus(order._id, "in_progress")
                    }
                  >
                    В обробці
                  </button>
                )}

                {order.status === "in_progress" && (
                  <button
                    onClick={() =>
                      updateOrderStatus(order._id, "ready")
                    }
                  >
                    Готово
                  </button>
                )}

                {order.status !== "cancelled" && (
                  <button
                    className="danger"
                    onClick={() =>
                      updateOrderStatus(order._id, "cancelled")
                    }
                  >
                    Скасувати
                  </button>
                )}
              </div>

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
  )
}
