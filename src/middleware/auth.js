const jwt = require('jsonwebtoken')
const register = require('../models/register')

async function auth(req, res, next) {
    try {
        const token = req.cookies.auth
        const verify = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await register.find({ token: token }).count()
        if (user === 0) {
            req.log = false
            next()
        } else {
            req.id = verify.id
            req.log = true
            next()
        }
    } catch {
        req.log = false
        next()
    }
}

module.exports = auth