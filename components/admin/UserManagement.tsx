"use client"

import { useState, useEffect } from "react"
import { Search, Edit, Trash, X, Check, UserPlus } from "lucide-react"
import type { User } from "@/types"

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isEditingUser, setIsEditingUser] = useState<string | null>(null)
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: "",
    email: "",
    role: "user",
  })
  const [editUser, setEditUser] = useState<Partial<User>>({})
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        // In a real app, this would be an API call
        const response = await fetch("/api/users")
        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }
        const data = await response.json()
        setUsers(data)
        setFilteredUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
        setError("Failed to load users. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = users.filter(
        (user) => user.name.toLowerCase().includes(term) || user.email.toLowerCase().includes(term),
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      setError("Name and email are required")
      return
    }

    if (!isValidEmail(newUser.email)) {
      setError("Please enter a valid email address")
      return
    }

    try {
      setError(null)
      // In a real app, this would be an API call
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to add user")
      }

      const addedUser = await response.json()
      setUsers([...users, addedUser])
      setNewUser({ name: "", email: "", role: "user" })
      setIsAddingUser(false)
      setSuccess("User added successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error("Error adding user:", error)
      setError(error instanceof Error ? error.message : "Failed to add user")
    }
  }

  const handleUpdateUser = async (id: string) => {
    if (!editUser.name || !editUser.email) {
      setError("Name and email are required")
      return
    }

    if (!isValidEmail(editUser.email)) {
      setError("Please enter a valid email address")
      return
    }

    try {
      setError(null)
      // In a real app, this would be an API call
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editUser),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update user")
      }

      const updatedUser = await response.json()
      setUsers(users.map((user) => (user.id === id ? updatedUser : user)))
      setIsEditingUser(null)
      setEditUser({})
      setSuccess("User updated successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error("Error updating user:", error)
      setError(error instanceof Error ? error.message : "Failed to update user")
    }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) {
      return
    }

    try {
      setError(null)
      // In a real app, this would be an API call
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete user")
      }

      setUsers(users.filter((user) => user.id !== id))
      setSuccess("User deleted successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (error) {
      console.error("Error deleting user:", error)
      setError(error instanceof Error ? error.message : "Failed to delete user")
    }
  }

  const startEditUser = (user: User) => {
    setIsEditingUser(user.id)
    setEditUser({ ...user })
    setError(null)
  }

  const cancelEdit = () => {
    setIsEditingUser(null)
    setEditUser({})
    setError(null)
  }

  const cancelAddUser = () => {
    setIsAddingUser(false)
    setNewUser({ name: "", email: "", role: "user" })
    setError(null)
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 p-2.5"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsAddingUser(true)}
            className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <UserPlus className="h-5 w-5 mr-1" />
            Add User
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
          <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {success && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{success}</span>
          <button className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setSuccess(null)}>
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {isAddingUser && (
        <div className="bg-indigo-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "user" | "admin" })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={cancelAddUser}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddUser}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Add User
            </button>
          </div>
        </div>
      )}

      <div className="bg-white overflow-hidden shadow-md rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    {searchTerm ? "No users match your search" : "No users found"}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditingUser === user.id ? (
                        <input
                          type="text"
                          className="w-full p-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          value={editUser.name || ""}
                          onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditingUser === user.id ? (
                        <input
                          type="email"
                          className="w-full p-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          value={editUser.email || ""}
                          onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                        />
                      ) : (
                        <div className="text-sm text-gray-500">{user.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditingUser === user.id ? (
                        <select
                          className="w-full p-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                          value={editUser.role || "user"}
                          onChange={(e) => setEditUser({ ...editUser, role: e.target.value as "user" | "admin" })}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "admin" ? "bg-indigo-100 text-indigo-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {isEditingUser === user.id ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleUpdateUser(user.id)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                            title="Save changes"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Cancel"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => startEditUser(user)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                            title="Edit user"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete user"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
