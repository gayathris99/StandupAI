import { useState } from 'react'
import { loginUser } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Login () {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState("")
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        try {
            const data = await loginUser(email, password)
            localStorage.setItem('token', data.access_token)
            localStorage.setItem('role', data.role)
            localStorage.setItem('name', data.name)
      
            if (data.role === 'lead') {
              navigate('/lead')
            } else {
              navigate('/engineer')
            }
      
        } catch (error) {
            setError(error.message)
        }
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-100'>
            <div className='bg-white p-8 rounded-xl shadow-md w-full max-w-md'>
            <h1 className="text-2xl font-bold mb-6 text-center">StandupAI Login</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
          />
          { error && <p className="text-red-500 text-sm">{error}</p> }
          <button
            type="submit"
            className="bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Login
          </button>
            <p className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <span
                onClick={() => navigate('/signup')}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Sign Up
              </span>
            </p>
            </form>
            </div>
        </div>
    )
}