import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import type { User } from "@/types"

// Helper function to read users from JSON file
function getUsers(): User[] {
  try {
    const filePath = path.join(process.cwd(), "data", "users.json")

    // Check if file exists, if not create it with default data
    if (!fs.existsSync(filePath)) {
      const defaultUsers = [
        {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        },
      ]
      fs.writeFileSync(filePath, JSON.stringify(defaultUsers, null, 2), "utf8")
      return defaultUsers
    }

    const fileData = fs.readFileSync(filePath, "utf8")
    return JSON.parse(fileData)
  } catch (error) {
    console.error("Error reading users:", error)
    return []
  }
}

// Helper function to write users to JSON file
function saveUsers(users: User[]): void {
  try {
    const dirPath = path.join(process.cwd(), "data")

    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }

    const filePath = path.join(dirPath, "users.json")
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf8")
  } catch (error) {
    console.error("Error saving users:", error)
  }
}

export async function GET() {
  try {
    const users = getUsers()
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const newUser = await request.json()
    const users = getUsers()

    // Validate required fields
    if (!newUser.name || !newUser.name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    if (!newUser.email || !newUser.email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newUser.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Check if email already exists
    if (users.some((user) => user.email.toLowerCase() === newUser.email.toLowerCase())) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Generate a unique ID
    newUser.id = Date.now().toString()

    // Ensure role is valid
    if (newUser.role !== "admin" && newUser.role !== "user") {
      newUser.role = "user" // Default to user if invalid role
    }

    users.push(newUser)
    saveUsers(users)

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
