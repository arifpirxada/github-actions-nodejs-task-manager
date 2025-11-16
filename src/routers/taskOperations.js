const express = require('express')
const router = new express.Router()
const task = require('../models/task')
const auth = require('../middleware/auth')

router.post('/', auth, async (req, res) => {
  try {
    if (req.log === false) {
      res.status(200).json({ message: 'notLogged' })
    } else {
      // Handle Add
      const taskData = req.body
      if (taskData.action === 'add') {
        const newTaskData = new task({
          userId: req.id,
          taskTitle: taskData.title,
          taskDesc: taskData.desc
        })

        await newTaskData.save()
        res.status(201).json({ message: 'Insertion successful' })
      } else {
        // Handle Fetch
        const userTasks = await task.find({ userId: req.id })

        if (userTasks.length != 0) {
          res.status(200).json(userTasks)
        } else {
          res.status(200).json({ message: 'noData' })
        }
      }
    }
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.patch('/', async (req, res) => {
  try {
    const _id = req.body.id
    await task.findByIdAndUpdate(_id, req.body)
    res.status(201).json({ message: 'Updation successful' })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.delete('/', async (req, res) => {
  try {
    const _id = req.body.id
    await task.findByIdAndDelete(_id)
    res.status(201).json({ message: 'Deletion successful' })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Internal server error' })
  }
})

module.exports = router
