import { useState, useEffect } from 'react'
import { submitStandup, fetchMyStandups } from '../api/index'

export default function EngineerView() {
  const [rawText, setRawText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])

  const name = localStorage.getItem('name')

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  useEffect(() => {
    loadHistory()
  }, [])

  async function loadHistory() {
    try {
      const data = await fetchMyStandups()
      setHistory(data)
    } catch (err) {
      console.log('Failed to load history:', err.message)
    }
  }

  async function handleSubmit() {
    if (!rawText.trim()) return
    setLoading(true)
    setError('')
    try {
      const data = await submitStandup(rawText)
      setResult(data)
      setRawText('')
      loadHistory()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-2">{getGreeting()}, {name}!</h1>
      <p className="text-gray-500 mb-6">What did you work on today?</p>

      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="e.g. Yesterday I fixed the login bug and reviewed 2 PRs. Today I'll work on the dashboard. Blocked on API docs from the backend team."
        className="w-full border rounded-xl p-4 h-48 outline-none focus:ring-2 focus:ring-blue-400 resize-none"
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-4 w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Submit Standup'}
      </button>

      {result && (
        <div className="mt-8 bg-white rounded-xl p-6 shadow">
          <h2 className="font-bold text-lg mb-4">Today's Summary</h2>
          <p className="text-gray-700 mb-4">{result.summary}</p>

          <h3 className="font-semibold mb-2">✅ Completed</h3>
          <ul className="list-disc list-inside mb-4">
            {result.tasks_completed.map((t, i) => <li key={i}>{t}</li>)}
          </ul>

          <h3 className="font-semibold mb-2">📋 Planned</h3>
          <ul className="list-disc list-inside mb-4">
            {result.tasks_planned.map((t, i) => <li key={i}>{t}</li>)}
          </ul>

          {result.has_blockers && (
            <>
              <h3 className="font-semibold mb-2">🚨 Blockers</h3>
              <ul className="list-disc list-inside">
                {result.blockers.map((b, i) => (
                  <li key={i}>{b.description} — <span className="text-red-500">{b.severity}</span></li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">Previous Standups</h2>
          <div className="flex flex-col gap-4">
            {history.map((standup) => (
              <div key={standup.id} className="bg-white rounded-xl p-5 shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">
                    {new Date(standup.created_at).toLocaleDateString()}
                  </span>
                  {standup.has_blockers && (
                    <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded-full">
                      Has Blockers
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{standup.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}