// Підключення стилів для футера
import "../styles/Footer.css"

// Компонент футера сайту
export default function Footer() {
  return (
    // Основний контейнер футера
    <footer className="footer">
      <div className="footer-container">
        
        {/* Блок з назвою ресторану */}
        <div className="footer-section">
          <h3>LUMIÈRE</h3>
          <p>Modern European Kitchen</p>
        </div>

        {/* Контактна інформація */}
        <div className="footer-section">
          <h4>Контакти</h4>
          <p>Телефон: +380 (44) 123-45-67</p>
          <p>Email: info@lumiere-restaurant.com</p>
        </div>

        {/* Години роботи ресторану */}
        <div className="footer-section">
          <h4>Години роботи</h4>
          <p>Пн-Нд: 10:00 - 23:00</p>
        </div>
      </div>

      {/* Нижня частина футера з копірайтом */}
      <div className="footer-bottom">
        <p>&copy; 2026 LUMIÈRE Restaurant. Всі права захищені.</p>
      </div>
    </footer>
  )
}
