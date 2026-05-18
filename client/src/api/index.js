const BASE_URL = 'https://standupai-server.onrender.com'

export async function loginUser(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Login failed')
  }

  return data
}

export async function submitStandup(rawText) {
  const token = localStorage.getItem('token')

  const response = await fetch(`${BASE_URL}/standups/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ raw_text: rawText })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Submission failed')
  }

  return data
}

export async function fetchMyStandups() {
    const token = localStorage.getItem('token')
    const response = await fetch('http://127.0.0.1:8000/api/standups/my', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.detail || 'Failed to fetch')
    return data
  }