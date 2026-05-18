const express = require('express')
const cors = require('cors')
const cron = require('node-cron')
require('dotenv').config()
const pool = require('./config/db')
const { generateWeeklyReport } = require('./services/weeklyReport')
const authRoutes = require('./routes/auth')
const standupRoutes = require('./routes/standups')
const verifyToken = require('./middleware/auth')

const app = express()
app.use(cors({
    origin: ['http://localhost:5173', 'https://standup-ai-woad.vercel.app/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/standups', verifyToken, standupRoutes)

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

// Runs every Monday at 9am
cron.schedule('0 9 * * 1', () => {
  console.log('Running weekly report...')
  generateWeeklyReport()
})

  

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})