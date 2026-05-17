const jwt = require('jsonwebtoken')

function verifyToken(req, res, next) {
    console.log('Middleware hit!')
    
    const authHeader = req.headers['authorization']
  
    if (!authHeader) {
      return res.status(401).json({ detail: 'No token provided' })
    }
  
    const token = authHeader.split(' ')[1]
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      console.log('Token decoded:', decoded)
      req.user = decoded
      next()
    } catch (err) {
      console.log('Token error:', err.message)
      return res.status(401).json({ detail: 'Invalid token' })
    }
  }
  

module.exports = verifyToken