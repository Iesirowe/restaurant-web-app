// Імпорт хуків React
import { useState, useEffect } from "react"
// API-клієнт для отримання даних меню
import api from "../api/api"
// Тип даних страви меню
import type { MenuItem } from "../types/types"
// Компонент картки меню
import MenuCard from "../components/MenuCard"
// Підключення стилів сторінки меню
import "../styles/Menu.css"

// Компонент сторінки меню
export default function Menu() {
  // Стани для меню, завантаження та помилок
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // Завантаження меню при першому рендері
  useEffect(() => {
    fetchMenu()
  }, [])

  // Отримання меню з сервера
  const fetchMenu = async () => {
    try {
      setLoading(true)
      const response = await api.get("/api/menu")
      setMenuItems(response.data.data)
      setError(null)
    } catch (err: any) {
      setError("Не вдалося завантажити меню")
      console.error("Error fetching menu:", err)
    } finally {
      setLoading(false)
    }
  }

  // Формування списку категорій (унікальні значення)
  const categories = [
    "all",
    ...new Set(
      Array.isArray(menuItems)
        ? menuItems.map((item) => item.category)
        : []
    ),
  ]

  // Фільтрація страв за обраною категорією
  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter(
          (item) => item.category === selectedCategory
        )

  // Відображення індикатора завантаження
  if (loading) {
    return (
      <div className="menu-page">
        <div className="loading">Завантаження меню...</div>
      </div>
    )
  }

  // Відображення повідомлення про помилку
  if (error) {
    return (
      <div className="menu-page">
        <div className="error">{error}</div>
        <button onClick={fetchMenu} className="btn btn-primary">
          Спробувати знову
        </button>
      </div>
    )
  }

  return (
    <div className="menu-page">
      {/* Заголовок сторінки меню */}
      <div className="menu-header">
        <h1>Наше меню</h1>
        <p>Обирайте серед найкращих страв європейської кухні</p>
      </div>

      {/* Фільтр за категоріями */}
      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${
              selectedCategory === category ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(category)}
          >
            {category === "all" ? "Всі страви" : category}
          </button>
        ))}
      </div>

      {/* Сітка з картками страв */}
      <div className="menu-grid">
        {filteredItems.map((item) => (
          <MenuCard key={item._id} item={item} />
        ))}
      </div>

      {/* Повідомлення, якщо в категорії немає страв */}
      {filteredItems.length === 0 && (
        <div className="empty-category">
          Немає страв у цій категорії
        </div>
      )}
    </div>
  )
}
