import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const name = localStorage.getItem('name')
  const role = localStorage.getItem('role')

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('name')
    navigate('/')
  }

  return (
    <nav className="bg-white border-b px-8 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-blue-500">StandupAI</h1>
      
      <div className="flex items-center gap-4">
        <span className="text-gray-500 text-sm">
          {name} · {role}
        </span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}