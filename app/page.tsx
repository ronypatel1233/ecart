"use client"

import { useEffect, useState } from "react"
import { useCart } from "@/context/CartContext"
import Image from "next/image"
import type { Product } from "@/types"

// Placeholder image path
const PLACEHOLDER_IMAGE = "/product-placeholder.svg"

// Simplified product card
const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart()

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="aspect-square overflow-hidden bg-gray-100 relative">
        <Image
          src={PLACEHOLDER_IMAGE}
          alt={product.name || "Product image"}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
          className="object-contain hover:scale-105 transition-transform duration-300"
          unoptimized
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-medium text-gray-900 mb-2 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">{product.description}</p>
        
        <div className="flex justify-between items-center mt-auto">
          <span className="text-lg font-bold text-indigo-600">${product.price.toFixed(2)}</span>
          
          <button
            onClick={() => addToCart(product, 1)}
            className="bg-indigo-600 text-white py-1.5 px-3 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

// Loading skeleton for product card
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
    <div className="aspect-square bg-gray-200 animate-pulse relative"></div>
    <div className="p-4">
      <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
      <div className="h-12 bg-gray-200 rounded animate-pulse mb-3"></div>
      <div className="flex justify-between">
        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
)

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products")
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json()
        setProducts(data.slice(0, 10)); // Get only 10 products
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">Product Listing</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {isLoading 
          ? Array.from({ length: 10 }).map((_, index) => <ProductCardSkeleton key={index} />)
          : products.map((product) => <ProductCard key={product.id} product={product} />)
        }
      </div>
    </main>
  )
}
