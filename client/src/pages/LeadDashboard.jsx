import { useState, useEffect } from 'react'

export default function LeadDashboard() {
  const [standups, setStandups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStandups()
  }, [])
const BASE_URL = 'https://standupai-server.onrender.com/api'
  async function fetchStandups() {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${BASE_URL}/api/standups/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.detail || 'Failed to fetch')
      setStandups(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-gray-500">Loading standups...</div>
  if (error) return <div className="p-8 text-red-500">{error}</div>

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-2">Lead Dashboard</h1>
      <p className="text-gray-500 mb-6">All team standups</p>

      {standups.length === 0 && (
        <p className="text-gray-400">No standups submitted yet.</p>
      )}

      <div className="flex flex-col gap-6">
        {standups.map((standup) => (
          <div key={standup.id} className="bg-white rounded-xl p-6 shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">{standup.engineer_name}</h2>
              <span className="text-sm text-gray-400">
                {new Date(standup.created_at).toLocaleDateString()}
              </span>
            </div>

            <p className="text-gray-700 mb-4">{standup.summary}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-semibold mb-2">✅ Completed</h3>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {standup.tasks_completed.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">📋 Planned</h3>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {standup.tasks_planned.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            </div>

            {standup.has_blockers && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-600 mb-2">🚨 Blockers</h3>
                <ul className="list-disc list-inside text-sm">
                  {standup.blockers.map((b, i) => (
                    <li key={i}>
                      {b.description} —{' '}
                      <span className={`font-semibold ${
                        b.severity === 'high' ? 'text-red-500' :
                        b.severity === 'medium' ? 'text-yellow-500' :
                        'text-green-500'
                      }`}>
                        {b.severity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}