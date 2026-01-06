// Імпорт хуків React та типу події форми
import { useState, useEffect, type FormEvent } from "react"
// API-клієнт для запитів до бекенду
import api from "../api/api"
// Типи даних меню та замовлення
import type { MenuItem, OrderItem } from "../types/types"
// Компонент картки страви
import MenuCard from "./MenuCard"
// Підключення стилів форм
import "../styles/Form.css"
import "../styles/OrderForm.css"

// Регулярні вирази для валідації імені та телефону
const NAME_REGEX = /^[A-Za-zА-Яа-яІіЇїЄєҐґ\s'-]{2,50}$/
const UA_PHONE_REGEX = /^\+380\d{9}$/

// Компонент форми оформлення замовлення
export default function OrderForm() {
  // Стани для меню, кошика та даних клієнта
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] =
    useState<{ type: "success" | "error"; text: string } | null>(null)

  // Завантаження меню при першому рендері
  useEffect(() => {
    fetchMenu()
  }, [])

  // Отримання меню з сервера
  const fetchMenu = async () => {
    try {
      const response = await api.get("/api/menu")
      setMenuItems(response.data.data)
    } catch (error) {
      console.error("Error fetching menu:", error)
    }
  }

  // Додавання страви до кошика
  const handleAddItem = (item: MenuItem) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === item._id)
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { menuItemId: item._id, quantity: 1 }]
    })
  }

  // Видалення страви з кошика
  const handleRemoveItem = (menuItemId: string) => {
    setSelectedItems((prev) =>
      prev.filter((i) => i.menuItemId !== menuItemId)
    )
  }

  // Зміна кількості страви
  const handleQuantityChange = (
    menuItemId: string,
    quantity: number
  ) => {
    if (quantity < 1) {
      handleRemoveItem(menuItemId)
      return
    }
    setSelectedItems((prev) =>
      prev.map((i) =>
        i.menuItemId === menuItemId ? { ...i, quantity } : i
      )
    )
  }

  // Підрахунок загальної суми замовлення
  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      const menuItem = menuItems.find(
        (m) => m._id === item.menuItemId
      )
      return total + (menuItem?.price || 0) * item.quantity
    }, 0)
  }

  // Обробка відправки форми
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setMessage(null)

    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 5)

    // Онлайн-замовлення дозволені лише з 10:00 до 21:00
    if (currentTime < "10:00" || currentTime > "21:00") {
      setMessage({
        type: "error",
        text: "Онлайн-замовлення приймаються з 10:00 до 21:00",
      })
      return
    }

    // Перевірка наявності страв у кошику
    if (selectedItems.length === 0) {
      setMessage({
        type: "error",
        text: "Додайте хоча б одну страву до замовлення",
      })
      return
    }

    // Валідація імені
    if (!NAME_REGEX.test(customerName.trim())) {
      setMessage({ type: "error", text: "Некоректне імʼя" })
      return
    }

    // Валідація номера телефону
    if (!UA_PHONE_REGEX.test(customerPhone.trim())) {
      setMessage({
        type: "error",
        text: "Номер має бути у форматі +380XXXXXXXXX",
      })
      return
    }

    setLoading(true)

    try {
      await api.post("/api/order", {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        items: selectedItems,
      })

      setMessage({
        type: "success",
        text: "Замовлення успішно створено!",
      })

      setSelectedItems([])
      setCustomerName("")
      setCustomerPhone("")
    } catch (error: any) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Помилка при створенні замовлення",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="order-form-container">
      <div className="order-menu-section">
        <h2>Оберіть страви</h2>
        <div className="menu-grid">
          {menuItems.map((item) => (
            <MenuCard
              key={item._id}
              item={item}
              onSelect={handleAddItem}
              showButton
            />
          ))}
        </div>
      </div>

      <div className="order-summary-section">
        <h2>Ваше замовлення</h2>

        {selectedItems.length === 0 ? (
          <p className="empty-cart">Кошик порожній</p>
        ) : (
          <div className="order-items">
            {selectedItems.map((item) => {
              const menuItem = menuItems.find(
                (m) => m._id === item.menuItemId
              )
              return (
                <div key={item.menuItemId} className="order-item">
                  <div className="order-item-info">
                    <span className="order-item-name">
                      {menuItem?.name}
                    </span>
                    <span className="order-item-price">
                      {(menuItem?.price || 0) * item.quantity} ₴
                    </span>
                  </div>
                  <div className="order-item-controls">
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(
                          item.menuItemId,
                          item.quantity - 1
                        )
                      }
                      className="quantity-btn"
                    >
                      −
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleQuantityChange(
                          item.menuItemId,
                          item.quantity + 1
                        )
                      }
                      className="quantity-btn"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveItem(item.menuItemId)
                      }
                      className="remove-btn"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )
            })}

            <div className="order-total">
              <strong>Загалом:</strong>
              <strong>{calculateTotal()} ₴</strong>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="order-customer-form">
          <div className="form-group">
            <label htmlFor="customerName">Ім'я</label>
            <input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="customerPhone">Телефон</label>
            <input
              id="customerPhone"
              type="tel"
              placeholder="+380 XX XXX XX XX"
              value={customerPhone}
              onChange={(e) =>
                setCustomerPhone(e.target.value.replace(/\s+/g, ""))
              }
              required
            />
          </div>

          {message && (
            <div className={`form-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button type="submit" className="form-submit" disabled={loading}>
            {loading ? "Оброблення..." : "Оформити замовлення"}
          </button>
        </form>
      </div>
    </div>
  )
}
