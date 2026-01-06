// Імпорт типу для дочірніх компонентів
import type { ReactNode } from "react"
// Підключення спільних компонентів інтерфейсу
import Header from "./Header"
import Footer from "./Footer"
// Підключення стилів макета
import "../styles/Layout.css"

// Інтерфейс пропсів компонента Layout
interface LayoutProps {
  children: ReactNode
}

// Компонент загального макета сторінки
export default function Layout({ children }: LayoutProps) {
  return (
    // Основний контейнер макета
    <div className="layout">
      {/* Шапка сайту */}
      <Header />
      
      {/* Основний контент сторінки */}
      <main className="main-content">{children}</main>
      
      {/* Футер сайту */}
      <Footer />
    </div>
  )
}
