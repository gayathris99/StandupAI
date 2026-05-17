const express = require('express')
const router = express.Router()
const pool = require('../config/db')
const { processStandup } = require('../services/ai')
const { sendBlockerAlert } = require('../services/email')

router.post('/submit', async (req, res) => {
  
    const { raw_text } = req.body
    const engineer_name = req.user.name
    const engineer_id = req.user.id
  
    try {
      const aiResult = await processStandup(raw_text, engineer_name)
  
      const result = await pool.query(
        `INSERT INTO standups 
          (engineer_id, engineer_name, raw_text, summary, tasks_completed, tasks_planned, blockers, has_blockers) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING *`,
        [
          engineer_id,
          engineer_name,
          raw_text,
          aiResult.summary,
          aiResult.tasks_completed,
          aiResult.tasks_planned,
          JSON.stringify(aiResult.blockers),
          aiResult.has_blockers
        ]
      )
      // Check if high severity blockers exist
        const highBlockers = aiResult.blockers.filter(b => b.severity === 'high')

        if (highBlockers.length > 0) {
        // fetch all leads from database
        const leads = await pool.query("SELECT email FROM users WHERE role = 'lead'")
        
        // send email to every lead
        for (const lead of leads.rows) {
            await sendBlockerAlert(lead.email, engineer_name, aiResult.blockers)
        }
    }
      res.json(result.rows[0])
    } catch (err) {
      res.status(500).json({ detail: err.message })
    }
  })

router.get('/all', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM standups ORDER BY created_at DESC`
        )
        res.json(result.rows)
    } catch (error) {
        res.status(400).json({ detail: error.message })
    }
})

router.get('/my', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM standups WHERE engineer_id =$1 ORDER BY created_at DESC',
            [req.user.id]
        )
        res.json(result.rows)
    } catch (error) {
        res.status(500).json({ detail: err.message })
    }
})

module.exports = router