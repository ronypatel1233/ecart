export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  password?: string // Optional for API purposes
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image?: string
  category?: string
  rating?: number
  stock?: number
  featured?: boolean
}
