'use client'

import { useEffect, useState } from "react"
import { useToast } from "../hooks/use-toast"
import { Trash2, ChevronDown, X, Search } from "lucide-react"
import { logout } from "../api/auth/logout"

type User = {
  id: string
  Name: string
  Email: string
  roleId: number
}
const API_BASE_URL = process.env.BASE_URL;

const roleMap: Record<number, string> = {
  1: "Пользователь",
  2: "Администратор",
  3: "Менеджер",
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)
  const [openRoleMenus, setOpenRoleMenus] = useState<Record<string, boolean>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<number | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin`)
      const json = await res.json()
      setUsers(json.data)
    } catch {
      toast({ title: "Ошибка", description: "Не удалось загрузить пользователей", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const updateRole = async (userId: string, newRole: number) => {
    try {
      const res = await fetch(`/api/admin/updateRole`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      })
      if (!res.ok) throw new Error("Ошибка при обновлении роли")
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, roleId: newRole } : u))
      toast({ title: "Успех", description: "Роль обновлена" })
    } catch (err: any) {
      toast({ title: "Ошибка", description: err.message, variant: "destructive" })
    }
  }

  const confirmDeleteUser = (user: User) => setDeletingUser(user)

  const handleDeleteUser = async () => {
    if (!deletingUser) return
    try {
      const res = await fetch(`/api/admin/deleteUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deletingUser),
      })
      if (!res.ok) throw new Error("Ошибка при удалении")
      setUsers(prev => prev.filter(u => u.id !== deletingUser.id))
      toast({ title: "Удалено", description: `Пользователь ${deletingUser.Name} удален` })
    } catch {
      toast({ title: "Ошибка", description: "Не удалось удалить", variant: "destructive" })
    } finally {
      setDeletingUser(null)
    }
  }

  const toggleRoleMenu = (userId: string) =>
    setOpenRoleMenus(prev => ({ ...prev, [userId]: !prev[userId] }))

  const closeAllMenus = () => setOpenRoleMenus({})

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase()
    const name = user.Name?.toLowerCase() ?? ""
    const email = user.Email?.toLowerCase() ?? ""
    const matchesSearch = name.includes(searchLower) || email.includes(searchLower)
    const matchesRole = filterRole ? user.roleId === filterRole : true
    return matchesSearch && matchesRole
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-gray-400 text-xl">
        Загрузка...
      </div>
    )
  }

  return (
    <div className="min-h-screen mt-[120px] p-8 font-sans text-gray-200" onClick={closeAllMenus}>
      <div className="max-w-7xl mx-auto">
        {/* Основной заголовок */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Панель администратора</h1>
          <button 
            onClick={() => logout()} 
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
          >
            Выйти
          </button>
        </div>

        {/* Блок поиска и фильтрации */}
        <div className="bg-[#2D3538]  rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Управление пользователями</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Поле поиска */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Поиск по имени или email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded bg-[#3C4447] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Фильтр по роли */}
            <select
              value={filterRole ?? ""}
              onChange={(e) => setFilterRole(e.target.value ? Number(e.target.value) : null)}
              className="px-4 py-2 rounded bg-[#3C4447] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Все роли</option>
              {Object.entries(roleMap).map(([num, label]) => (
                <option key={num} value={num}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Карточки пользователей */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-[#3C4447] rounded-lg shadow-lg p-6 relative hover:shadow-xl transition-shadow duration-300">
              <button
                className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                title="Удалить"
                onClick={() => confirmDeleteUser(user)}
              >
                <Trash2 className="w-5 h-5" />
              </button>
              
              <div className="mb-4">
                <h2 className="text-xl font-semibold">{user.Name}</h2>
                <p className="text-sm text-gray-400">{user.Email}</p>
              </div>
              
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  className="w-full flex justify-between items-center bg-[#2D3538] px-4 py-2 rounded-md hover:bg-gray-600 transition"
                  onClick={() => toggleRoleMenu(user.id)}
                >
                  <span className="font-medium">{roleMap[user.roleId]}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {openRoleMenus[user.id] && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#3C4447] border border-gray-600 rounded-md shadow-lg z-10">
                    {Object.entries(roleMap).map(([roleNum, label]) => (
                      <button
                        key={roleNum}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                        onClick={() => {
                          updateRole(user.id, Number(roleNum))
                          setOpenRoleMenus(prev => ({ ...prev, [user.id]: false }))
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Модальное окно удаления */}
        {deletingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="bg-[#3C4447] p-6 rounded-lg max-w-sm w-full relative shadow-lg">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
                onClick={() => setDeletingUser(null)}
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-semibold mb-4">Подтвердите удаление</h3>
              <p className="mb-6">Вы уверены, что хотите удалить <strong>{deletingUser.Name}</strong>?</p>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition"
                  onClick={() => setDeletingUser(null)}
                >
                  Отмена
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  onClick={handleDeleteUser}
                >
                  Удалить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}