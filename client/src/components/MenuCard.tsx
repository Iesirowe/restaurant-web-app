// Імпорт типу страви меню
import type { MenuItem } from "../types/types"
// Підключення стилів для картки меню
import "../styles/MenuCard.css"

// Інтерфейс пропсів компонента MenuCard
interface MenuCardProps {
  item: MenuItem
  onSelect?: (item: MenuItem) => void
  showButton?: boolean
}

// Компонент картки страви меню
export default function MenuCard({ item, onSelect, showButton = false }: MenuCardProps) {
  return (
    // Основний контейнер картки
    <div className="menu-card">
      {/* Відображення зображення страви, якщо воно існує */}
      {item.image && (
        <div className="menu-card-image">
          <img src={item.image || "/placeholder.svg"} alt={item.name} />
        </div>
      )}

      <div className="menu-card-content">
        {/* Заголовок картки з назвою та ціною */}
        <div className="menu-card-header">
          <h3 className="menu-card-title">{item.name}</h3>
          <span className="menu-card-price">{item.price} ₴</span>
        </div>

        {/* Опис страви */}
        <p className="menu-card-description">{item.description}</p>

        {/* Кнопка додавання до замовлення */}
        {showButton && onSelect && (
          <button className="menu-card-button" onClick={() => onSelect(item)}>
            Додати до замовлення
          </button>
        )}
      </div>
    </div>
  )
}
