import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import type { Product } from "@/types"

// Helper function to read products from JSON file
function getProducts(): Product[] {
  try {
    const filePath = path.join(process.cwd(), "data", "products.json")
    const fileData = fs.readFileSync(filePath, "utf8")
    return JSON.parse(fileData)
  } catch (error) {
    console.error("Error reading products:", error)
    return []
  }
}

// Helper function to write products to JSON file
function saveProducts(products: Product[]): void {
  try {
    const filePath = path.join(process.cwd(), "data", "products.json")
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), "utf8")
  } catch (error) {
    console.error("Error saving products:", error)
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const products = getProducts()
    const product = products.find((p) => p.id === params.id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const updatedProduct = await request.json()
    const products = getProducts()
    const index = products.findIndex((p) => p.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    products[index] = { ...products[index], ...updatedProduct, id: params.id }
    saveProducts(products)

    return NextResponse.json(products[index])
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const products = getProducts()
    const index = products.findIndex((p) => p.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    products.splice(index, 1)
    saveProducts(products)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
