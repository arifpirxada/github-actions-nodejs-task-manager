const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  taskTitle: {
    type: String,
    required: true
  },
  taskDesc: {
    type: String,
    required: true
  }
})

const task = new mongoose.model('task', taskSchema)

module.exports = task
