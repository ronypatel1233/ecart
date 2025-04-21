import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import type { User } from "@/types"

interface UserWithPassword extends User {
  password?: string;
}

// Helper function to read users from JSON file
function getUsers(): UserWithPassword[] {
  try {
    const filePath = path.join(process.cwd(), "data", "users.json")
    const fileData = fs.readFileSync(filePath, "utf8")
    return JSON.parse(fileData)
  } catch (error) {
    console.error("Error reading users:", error)
    return []
  }
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }
    
    const users = getUsers()

    // Find user with matching email and password
    const user = users.find((u) => 
      u.email === email && u.password === password
    )

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // For admin access, check if user has admin role
    if (user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 })
    }

    // Don't send the password back to the client
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Error during login:", error)
    return NextResponse.json({ error: "Failed to login" }, { status: 500 })
  }
}
