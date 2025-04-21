"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useCart } from "@/context/CartContext"
import { Star, ShoppingCart, Heart, Eye } from "lucide-react"
import type { Product } from "@/types"

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<string>("featured")
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json()
        setProducts(data)
        
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(data.map((p: Product) => p.category).filter(Boolean))
        ) as string[]
        setCategories(uniqueCategories)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const filteredProducts = products
    .filter(product => !selectedCategory || product.category === selectedCategory)
    .sort((a, b) => {
      switch (sortOrder) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "name-asc":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "featured":
        default:
          return ((b.featured ? 1 : 0) - (a.featured ? 1 : 0))
      }
    })

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1)
  }

  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating)
    const stars = []
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
      } else {
        stars.push(<Star key={i} className="h-4 w-4 text-gray-300" />)
      }
    }
    
    return (
      <div className="flex items-center">
        <div className="flex mr-1">{stars}</div>
        <span className="text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
        {categories.length > 0 && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1 rounded-full whitespace-nowrap text-sm ${
                selectedCategory === null
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              All Products
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full whitespace-nowrap text-sm ${
                  selectedCategory === category
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
        
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 text-sm text-gray-700">Sort by:</label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
          >
            <div className="relative group">
              <Link href={`/products/${product.id}`}>
                <img
                  src={product.image || "/placeholder.svg?height=300&width=400"}
                  alt={product.name}
                  className="w-full h-48 md:h-56 object-cover group-hover:opacity-90 transition-opacity"
                />
              </Link>
              {product.featured && (
                <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-medium px-2 py-1 rounded">
                  Featured
                </div>
              )}
              {(product.stock !== undefined && product.stock <= 10) && (
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded">
                  Low Stock
                </div>
              )}
              <div className="absolute right-2 bottom-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="bg-white p-1.5 rounded-full shadow-sm hover:bg-indigo-50">
                  <Heart className="h-4 w-4 text-indigo-600" />
                </button>
                <button className="bg-white p-1.5 rounded-full shadow-sm hover:bg-indigo-50">
                  <Eye className="h-4 w-4 text-indigo-600" />
                </button>
              </div>
            </div>
            
            <div className="p-4 flex-grow flex flex-col">
              {product.category && (
                <div className="mb-1">
                  <span className="text-xs text-indigo-600 font-medium">{product.category}</span>
                </div>
              )}
              <Link href={`/products/${product.id}`} className="group">
                <h3 className="text-sm font-medium text-gray-900 group-hover:text-indigo-600 transition-colors mb-1 line-clamp-2">
                  {product.name}
                </h3>
              </Link>
              {product.rating && (
                <div className="my-1">
                  {renderStarRating(product.rating)}
                </div>
              )}
              <p className="text-xs text-gray-600 mb-3 line-clamp-2 flex-grow">{product.description}</p>
              <div className="mt-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-indigo-600 font-bold">${product.price.toFixed(2)}</span>
                  {product.stock !== undefined && (
                    <span className="text-xs text-gray-500">{product.stock} left</span>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1 text-xs font-medium"
                >
                  <ShoppingCart className="h-3 w-3" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-700">No products found</h3>
          <p className="text-sm text-gray-500 mt-1">Try changing your filter or browse other categories</p>
        </div>
      )}
    </div>
  )
}
