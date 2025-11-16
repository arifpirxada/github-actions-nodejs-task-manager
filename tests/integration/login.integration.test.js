const request = require('supertest')
const express = require('express')
const cookieParser = require('cookie-parser')

describe('Login Route - Integration (mocked DB, stable)', () => {
  let app
  beforeAll(() => {
    process.env.JWT_SECRET_KEY = 'testsecret'
    // Stable mocks for data layer
    jest.resetModules()
    jest.doMock(
      '../../src/models/register',
      () => {
        return {
          find: jest
            .fn()
            .mockResolvedValue([
              { _id: 'mockid', name: 'Alice', password: 'hashed' }
            ]),
          findByIdAndUpdate: jest.fn()
        }
      },
      { virtual: true }
    )
    jest.doMock(
      'bcryptjs',
      () => ({ compare: jest.fn().mockResolvedValue(true) }),
      { virtual: true }
    )

    const signupRouter = require('../../src/routers/signup')
    const loginRouter = require('../../src/routers/login')

    app = express()
    app.use(express.json())
    app.use(cookieParser())
    app.use('/', signupRouter)
    app.use('/', loginRouter)
  })

  afterAll(() => {
    jest.resetModules()
  })

  test('Login success returns 200 with cookie', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email: 'alice@example.com', pass: 'secret' })
    expect(res.status).toBe(200)
    expect(res.headers['set-cookie']).toBeDefined()
  })
})
