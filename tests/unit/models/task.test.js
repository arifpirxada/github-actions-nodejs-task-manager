const Task = require('../../../src/models/task')

describe('Task model validation', () => {
  test('valid document passes', () => {
    const doc = new Task({ userId: 'u1', taskTitle: 'title', taskDesc: 'desc' })
    const err = doc.validateSync()
    expect(err).toBeUndefined()
  })

  test('missing userId fails', () => {
    const doc = new Task({ taskTitle: 'title', taskDesc: 'desc' })
    const err = doc.validateSync()
    expect(err.errors.userId).toBeDefined()
  })

  test('missing taskTitle fails', () => {
    const doc = new Task({ userId: 'u1', taskDesc: 'desc' })
    const err = doc.validateSync()
    expect(err.errors.taskTitle).toBeDefined()
  })

  test('missing taskDesc fails', () => {
    const doc = new Task({ userId: 'u1', taskTitle: 'title' })
    const err = doc.validateSync()
    expect(err.errors.taskDesc).toBeDefined()
  })
})
