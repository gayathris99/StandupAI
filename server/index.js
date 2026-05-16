const express = require('express')
const cors = require('cors')
require('dotenv').config()
const pool = require('./config/db')
const authRoutes = require('./routes/auth')

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/auth', authRoutes)

app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.log('DB connection failed:', err)
    } else {
      console.log('DB connected at:', res.rows[0].now)
    }
  })
  

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})