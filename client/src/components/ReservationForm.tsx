// Імпорт хуків React та типу події форми
import { useState, type FormEvent } from "react"
// API-клієнт для взаємодії з бекендом
import api from "../api/api"
// Підключення стилів для форм
import "../styles/Form.css"

// Компонент форми бронювання столика
export default function ReservationForm() {
  // Стан для даних форми бронювання
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: 2,
    name: "",
    phone: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] =
    useState<{ type: "success" | "error"; text: string } | null>(null)

  // Обробка відправки форми
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setMessage(null)


    // Робочі години ресторану
    if (formData.time < "10:00" || formData.time > "23:00") {
      setMessage({
        type: "error",
        text: "Бронювання можливе лише з 10:00 до 23:00",
      })
      return
    }

    // Останній можливий час початку бронювання (2 години резерву)
    if (formData.time > "21:00") {
      setMessage({
        type: "error",
        text: "Останній час бронювання — 21:00 (столик резервується на 2 години)",
      })
      return
    }

    // ⏳ Мінімум за 2 години до візиту
    const now = new Date()
    const reservationDateTime = new Date(
      `${formData.date}T${formData.time}`
    )

    const diffMs = reservationDateTime.getTime() - now.getTime()
    const diffHours = diffMs / (1000 * 60 * 60)

    if (diffHours < 2) {
      setMessage({
        type: "error",
        text: "Бронювання можливе мінімум за 2 години до візиту",
      })
      return
    }

    setLoading(true)

    try {
      await api.post("/api/reservation", formData)

      setMessage({
        type: "success",
        text: "Бронювання успішно створено!",
      })

      // Очищення форми
      setFormData({
        date: "",
        time: "",
        guests: 2,
        name: "",
        phone: "",
      })
    } catch (error: any) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Помилка при створенні бронювання",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    // Форма бронювання
    <form className="reservation-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="date">Дата</label>
        <input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) =>
            setFormData({ ...formData, date: e.target.value })
          }
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="time">Час</label>
        <input
          id="time"
          type="time"
          min="10:00"
          max="23:00"
          value={formData.time}
          onChange={(e) =>
            setFormData({ ...formData, time: e.target.value })
          }
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="guests">Кількість гостей</label>
        <input
          id="guests"
          type="number"
          min="1"
          max="20"
          value={formData.guests}
          onChange={(e) =>
            setFormData({
              ...formData,
              guests: Number.parseInt(e.target.value),
            })
          }
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="name">Ім'я</label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Телефон</label>
        <input
          id="phone"
          type="tel"
          placeholder="+380 XX XXX XX XX"
          value={formData.phone}
          onChange={(e) =>
            setFormData({ ...formData, phone: e.target.value })
          }
          required
        />
      </div>

      {/* Повідомлення про результат */}
      {message && (
        <div className={`form-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <button type="submit" className="form-submit" disabled={loading}>
        {loading ? "Оброблення..." : "Забронювати столик"}
      </button>
    </form>
  )
}
