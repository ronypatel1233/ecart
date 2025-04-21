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

export async function GET() {
  try {
    const products = getProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newProduct = await request.json()
    const products = getProducts()

    // Generate a unique ID
    newProduct.id = Date.now().toString()

    products.push(newProduct)
    saveProducts(products)

    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
