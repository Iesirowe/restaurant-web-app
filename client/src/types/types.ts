export interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
}

export interface Reservation {
  _id?: string
  date: string
  time: string
  guests: number
  name: string
  phone: string
  tableId?: Table
  status?: "pending" | "confirmed" | "cancelled"
  createdAt?: string
  updatedAt?: string
}


export interface OrderItem {
  menuItemId: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  _id?: string
  name: string
  phone: string
  items: OrderItem[]
  comment?: string
  totalAmount: number
  status: "pending" | "confirmed" | "completed"
  createdAt?: string
}


export interface Table {
  _id: string
  number: number
  seats: number
}
