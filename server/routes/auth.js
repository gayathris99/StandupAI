const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/db')

router.post('/signup', async( req, res) => {
    const { email, password, name, role } = req.body
    try {
        const isExisting = await pool.query('SELECT * FROM USERS WHERE email = $1', [email])
        if (isExisting.rows.length > 0) {
            return res.status(400).json({ detail : 'Email exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await pool.query(
            'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, hashedPassword, name, role]
        )
        res.json({ message: 'User created successfully'})
    } catch (error) {
        res.status(500).json({ detail: error.message })
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
        if (result.rows.length === 0) {
            res.status(400).json({ detail: 'User does not exist'})
        }
        const user = result.rows[0]

        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            res.status(400).json({ detail: 'Invalid Password'})
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } 
        )
        res.json({
        access_token: token,
        token_type: 'bearer',
        role: user.role,
        name: user.name
        })
    } catch (error) {
        res.status(500).json({ details: error.message })
    }
})

module.exports = router
