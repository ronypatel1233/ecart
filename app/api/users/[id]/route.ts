import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import type { User } from "@/types"

// Helper function to read users from JSON file
function getUsers(): User[] {
  try {
    const filePath = path.join(process.cwd(), "data", "users.json")
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
    const filePath = path.join(process.cwd(), "data", "users.json")
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), "utf8")
  } catch (error) {
    console.error("Error saving users:", error)
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const users = getUsers()
    const user = users.find((u) => u.id === params.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const updatedUser = await request.json()
    const users = getUsers()
    const index = users.findIndex((u) => u.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Validate required fields
    if (!updatedUser.name || !updatedUser.name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    if (!updatedUser.email || !updatedUser.email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(updatedUser.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Check if email is being changed and if it already exists
    if (
      updatedUser.email &&
      updatedUser.email.toLowerCase() !== users[index].email.toLowerCase() &&
      users.some((user) => user.email.toLowerCase() === updatedUser.email.toLowerCase())
    ) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Ensure role is valid
    if (updatedUser.role !== "admin" && updatedUser.role !== "user") {
      updatedUser.role = users[index].role // Keep existing role if invalid
    }

    users[index] = { ...users[index], ...updatedUser, id: params.id }
    saveUsers(users)

    return NextResponse.json(users[index])
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const users = getUsers()
    const index = users.findIndex((u) => u.id === params.id)

    if (index === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Prevent deleting the last admin user
    if (users[index].role === "admin" && users.filter((u) => u.role === "admin").length <= 1) {
      return NextResponse.json({ error: "Cannot delete the last admin user" }, { status: 400 })
    }

    users.splice(index, 1)
    saveUsers(users)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
