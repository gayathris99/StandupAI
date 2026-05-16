import { useState } from 'react'

export default function EngineerView() {
  const [rawText, setRawText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const name = localStorage.getItem('name')

  async function handleSubmit() {
    if (!rawText.trim()) return
    setLoading(true)
    // API call will go here later
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-2xl font-bold mb-2">Good morning, {name}!</h1>
        <p className="text-gray-500 mb-6">What did you work on today?</p>

        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="e.g. Yesterday I fixed the login bug and reviewed 2 PRs. Today I'll work on the dashboard. Blocked on API docs from the backend team."
          className="w-full border rounded-xl p-4 h-48 outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Submit Standup'}
        </button>

        {result && (
          <div className="mt-8 bg-white rounded-xl p-6 shadow">
            <h2 className="font-bold text-lg mb-4">Your Standup Summary</h2>
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

      </div>
    </div>
  )
}