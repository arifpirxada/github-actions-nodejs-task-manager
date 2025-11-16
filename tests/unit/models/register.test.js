const Register = require('../../../src/models/register')

describe('Register model validation', () => {
  test('valid document passes validation', () => {
    const doc = new Register({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'secret'
    })
    const err = doc.validateSync()
    expect(err).toBeUndefined()
  })

  test('missing name fails', () => {
    const doc = new Register({ email: 'alice@example.com', password: 'secret' })
    const err = doc.validateSync()
    expect(err.errors.name).toBeDefined()
  })

  test('missing email fails', () => {
    const doc = new Register({ name: 'Alice', password: 'secret' })
    const err = doc.validateSync()
    expect(err.errors.email).toBeDefined()
  })

  test('missing password fails', () => {
    const doc = new Register({ name: 'Alice', email: 'alice@example.com' })
    const err = doc.validateSync()
    expect(err.errors.password).toBeDefined()
  })
})
