"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useCart } from "@/context/CartContext"
import { Star, ShoppingCart, Heart, Share2, ArrowLeft, Truck, Shield, RefreshCw } from "lucide-react"
import Link from "next/link"
import type { Product } from "@/types"

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // In a real app, this would be an API call
        const response = await fetch(`/api/products/${params.id}`)
        if (!response.ok) {
          throw new Error("Product not found")
        }
        const data = await response.json()
        setProduct(data)
        
        // Fetch similar products
        const allProductsResponse = await fetch('/api/products')
        const allProducts = await allProductsResponse.json()
        
        // Filter for similar products in the same category (excluding current product)
        const similar = allProducts
          .filter((p: Product) => p.category === data.category && p.id !== data.id)
          .slice(0, 4)
          
        setSimilarProducts(similar)
      } catch (error) {
        console.error("Error fetching product:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, router])

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
    }
  }

  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const stars = []
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400 half-star" />)
      } else {
        stars.push(<Star key={i} className="h-5 w-5 text-gray-300" />)
      }
    }
    
    return (
      <div className="flex items-center">
        <div className="flex mr-2">{stars}</div>
        <span className="text-gray-600">({rating.toFixed(1)})</span>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 h-96 bg-gray-200 animate-pulse rounded-lg"></div>
            <div className="md:w-1/2">
              <div className="h-10 bg-gray-200 animate-pulse rounded mb-4 w-3/4"></div>
              <div className="h-8 bg-gray-200 animate-pulse rounded mb-4 w-1/4"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-full"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-2/3"></div>
              <div className="h-12 bg-gray-200 animate-pulse rounded mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Product not found</h1>
        <p className="text-gray-600 mb-8">The product you're looking for does not exist or has been removed.</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 inline-flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/" className="hover:text-indigo-600">Products</Link>
          <span className="mx-2">/</span>
          <Link href={`/?category=${product.category}`} className="hover:text-indigo-600">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>
        
        <div className="flex flex-col lg:flex-row gap-12 mb-16">
          {/* Product Images */}
          <div className="lg:w-1/2">
            <div className="relative bg-white p-2 rounded-lg shadow-md mb-4">
              <img
                src={product.image || "/placeholder.svg?height=600&width=600"}
                alt={product.name}
                className="w-full h-auto object-contain rounded-md"
                style={{ maxHeight: "500px" }}
              />
              {product.featured && (
                <div className="absolute top-4 left-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Featured
                </div>
              )}
              {(product.stock !== undefined && product.stock <= 10) && (
                <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Only {product.stock} left
                </div>
              )}
            </div>
            
            {/* Thumbnails would go here in a real implementation */}
            <div className="grid grid-cols-4 gap-2">
              {Array(4).fill(0).map((_, index) => (
                <div 
                  key={index}
                  className={`border-2 rounded cursor-pointer ${index === activeImageIndex ? 'border-indigo-600' : 'border-gray-200'}`}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img
                    src={product.image || `/placeholder.svg?height=100&width=100&text=View ${index + 1}`}
                    alt={`${product.name} view ${index + 1}`}
                    className="rounded h-24 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="lg:w-1/2">
            <div className="mb-2">
              <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-3">{product.name}</h1>
            
            {product.rating && (
              <div className="mb-4">
                {renderStarRating(product.rating)}
              </div>
            )}
            
            <div className="flex items-center mb-6">
              <span className="text-3xl font-bold text-indigo-600">${product.price.toFixed(2)}</span>
              {product.stock !== undefined ? (
                product.stock > 0 ? (
                  <span className="ml-4 text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="ml-4 text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full">
                    Out of Stock
                  </span>
                )
              ) : null}
            </div>
            
            <div className="prose prose-indigo max-w-none mb-8">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>
            
            {/* Product Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center">
                <Truck className="h-6 w-6 text-indigo-600 mr-2" />
                <span className="text-sm">Free shipping</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-indigo-600 mr-2" />
                <span className="text-sm">2 Year Warranty</span>
              </div>
              <div className="flex items-center">
                <RefreshCw className="h-6 w-6 text-indigo-600 mr-2" />
                <span className="text-sm">30-Day Returns</span>
              </div>
            </div>
            
            {/* Add to Cart */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center space-x-4 mb-6">
                <label htmlFor="quantity" className="text-gray-700 font-medium">
                  Quantity:
                </label>
                <div className="flex items-center border rounded-md">
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={product.stock === 0}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    id="quantity"
                    min="1"
                    max={product.stock || 1}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock || 1, Number.parseInt(e.target.value) || 1)))}
                    className="w-16 text-center border-0 focus:ring-0"
                    disabled={product.stock === 0}
                  />
                  <button
                    type="button"
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                    onClick={() => setQuantity(Math.min(product.stock || 1, quantity + 1))}
                    disabled={product.stock === 0 || quantity >= (product.stock || 0)}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 py-3 px-6 font-medium rounded-md flex items-center justify-center gap-2 ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors'
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                
                <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Heart className="h-6 w-6 text-gray-600" />
                </button>
                
                <button className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Share2 className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => (
                <div
                  key={similarProduct.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <Link href={`/products/${similarProduct.id}`}>
                    <img
                      src={similarProduct.image || "/placeholder.svg?height=200&width=300"}
                      alt={similarProduct.name}
                      className="w-full h-48 object-cover"
                    />
                  </Link>
                  <div className="p-4">
                    <Link href={`/products/${similarProduct.id}`}>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 hover:text-indigo-600 transition-colors line-clamp-1">
                        {similarProduct.name}
                      </h3>
                    </Link>
                    
                    {similarProduct.rating && (
                      <div className="flex items-center mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={`star-${i}`}
                              className={`h-4 w-4 ${i < Math.floor(similarProduct.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <p className="text-indigo-600 font-bold">${similarProduct.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
