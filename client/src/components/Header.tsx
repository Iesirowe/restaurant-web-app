// Імпорт компонентів навігації та хука для визначення поточного шляху
import { Link, useLocation } from "react-router-dom"
// Підключення стилів для хедера
import "../styles/Header.css"

// Компонент шапки сайту
export default function Header() {
  // Отримання поточного маршруту
  const location = useLocation()

  // Функція для перевірки активного пункту меню
  const isActive = (path: string) => location.pathname === path

  return (
    // Основний контейнер хедера
    <header className="header">
      <div className="header-container">
        
        {/* Логотип та назва ресторану */}
        <Link to="/" className="logo">
          <span className="logo-name">LUMIÈRE</span>
          <span className="logo-tagline">Modern European Kitchen</span>
        </Link>

        {/* Навігаційне меню сайту */}
        <nav className="nav">
          <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
            Головна
          </Link>
          <Link to="/menu" className={`nav-link ${isActive("/menu") ? "active" : ""}`}>
            Меню
          </Link>
          <Link to="/reservation" className={`nav-link ${isActive("/reservation") ? "active" : ""}`}>
            Бронювання
          </Link>
          <Link to="/order" className={`nav-link ${isActive("/order") ? "active" : ""}`}>
            Замовлення
          </Link>
          <Link to="/admin" className={`nav-link ${isActive("/admin") ? "active" : ""}`}>
            Адмін
          </Link>
        </nav>
      </div>
    </header>
  )
}
