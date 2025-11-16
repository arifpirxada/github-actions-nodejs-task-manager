const express = require('express')
const router = new express.Router()
const register = require('../models/register')
const auth = require('../middleware/auth')

router.get('/logout', auth, async (req, res) => {
  try {
    res.clearCookie('auth')
    await register.findByIdAndUpdate({ _id: req.id }, { $set: { token: '' } })
    res.status(200).redirect('/login')
  } catch (e) {
    console.log(e)
    res.status(400).json({ message: 'Internal server error' })
  }
})

module.exports = router
