const request = require('supertest')
const express = require('express')
const cookieParser = require('cookie-parser')

describe('Auth Routes Integration (mocked DB)', () => {
  let app
  let signupRouter
  let loginRouter
  let MockRegisterSaveBehavior = 'resolve'

  beforeEach(() => {
    jest.resetModules()
    // Default: allow signup to succeed
    MockRegisterSaveBehavior = 'resolve'
    process.env.JWT_SECRET_KEY = 'testsecret'

    // Mock the Register model used by signup and login routes
    jest.doMock(
      '../../src/models/register',
      () => {
        return class MockRegister {
          constructor(data) {
            Object.assign(this, data)
            this._id = 'mockid'
            this.save = jest.fn().mockImplementation(() => {
              if (MockRegisterSaveBehavior === 'reject') {
                const err = new Error('duplicate')
                err.code = 11000
                err.keyPattern = { email: 1 }
                throw err
              }
              return Promise.resolve(this)
            })
          }
        }
      },
      { virtual: true }
    )

    const appModule = require('express')()
    appModule.use(express.json())
    appModule.use(cookieParser())
    // mount routers
    signupRouter = require('../../src/routers/signup')
    loginRouter = require('../../src/routers/login')
    appModule.use('/', signupRouter)
    appModule.use('/', loginRouter)
    app = appModule
  })

  afterEach(() => {
    jest.resetModules()
  })

  test('Signup success returns 201 and cookie set', async () => {
    const res = await request(app)
      .post('/signup')
      .send({ name: 'Alice', email: 'alice@example.com', pass: 'secret' })
    expect(res.status).toBe(201)
    expect(res.headers['set-cookie']).toBeDefined()
  })

  test('Signup email exists returns 400', async () => {
    MockRegisterSaveBehavior = 'reject'
    // re-require to apply new mock behavior
    jest.resetModules()
    jest.doMock(
      '../../src/models/register',
      () => {
        return class MockRegister {
          constructor(data) {
            Object.assign(this, data)
            this._id = 'mockid'
            this.save = jest.fn().mockImplementation(() => {
              if (MockRegisterSaveBehavior === 'reject') {
                const err = new Error('duplicate')
                err.code = 11000
                err.keyPattern = { email: 1 }
                throw err
              }
              return Promise.resolve(this)
            })
          }
        }
      },
      { virtual: true }
    )
    signupRouter = require('../../src/routers/signup')
    loginRouter = require('../../src/routers/login')
    app = express()
    app.use(express.json())
    app.use(cookieParser())
    app.use('/', signupRouter)
    app.use('/', loginRouter)

    const res = await request(app)
      .post('/signup')
      .send({ name: 'Bob', email: 'bob@example.com', pass: 'secret' })
    expect(res.status).toBe(400)
  })

  test.skip('Login success returns 200', async () => {
    // Mock login DB lookup
    jest.resetModules()
    const mockRegister = {
      find: jest
        .fn()
        .mockResolvedValue([
          { _id: 'mockid', name: 'Alice', password: 'hashed' }
        ]),
      findByIdAndUpdate: jest.fn()
    }
    jest.doMock('../../src/models/register', () => mockRegister, {
      virtual: true
    })
    // Mock bcrypt compare to always return true
    jest.doMock(
      'bcryptjs',
      () => ({ compare: jest.fn().mockResolvedValue(true) }),
      { virtual: true }
    )

    signupRouter = require('../../src/routers/signup')
    loginRouter = require('../../src/routers/login')
    app = express()
    app.use(express.json())
    app.use(cookieParser())
    app.use('/', signupRouter)
    app.use('/', loginRouter)

    const res = await request(app)
      .post('/login')
      .send({ email: 'alice@example.com', pass: 'secret' })
    expect(res.status).toBe(200)
  })

  test.skip('Login user not found returns 400', async () => {
    jest.resetModules()
    const mockRegister = {
      find: jest.fn().mockResolvedValue([]),
      findByIdAndUpdate: jest.fn()
    }
    jest.doMock('../../src/models/register', () => mockRegister, {
      virtual: true
    })
    jest.doMock(
      'bcryptjs',
      () => ({ compare: jest.fn().mockResolvedValue(false) }),
      { virtual: true }
    )

    signupRouter = require('../../src/routers/signup')
    loginRouter = require('../../src/routers/login')
    app = express()
    app.use(express.json())
    app.use(cookieParser())
    app.use('/', signupRouter)
    app.use('/', loginRouter)

    const res = await request(app)
      .post('/login')
      .send({ email: 'notfound@example.com', pass: 'secret' })
    expect(res.status).toBe(400)
  })
})
