const express = require("express")
const app = express()
const path = require("path")
const hbs = require("hbs")
require("dotenv").config()
require(path.join(__dirname, "./db/dbCon"))
const loginRouter = require("./routers/login")
const signupRouter = require("./routers/signup")
const addTaskRouter = require("./routers/taskOperations")
const logoutRouter = require("./routers/logout")
const auth = require('./middleware/auth')
const cookieParser = require("cookie-parser")

app.use(express.static(path.join(__dirname, "../public")))

app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "./templates/views"))

hbs.registerPartials(path.join(__dirname, "./templates/partials"))

app.use(cookieParser())
app.use(express.json())
app.use(loginRouter)
app.use(signupRouter)
app.use(addTaskRouter)
app.use(logoutRouter)

app.get("/", auth, (req, res) => {
    res.setHeader('Content-Type', 'text/html')
    res.render("index")
})

app.get("/signup", auth, (req, res) => {
    if (req.log) return res.redirect("/")
    res.render("signup")
})

app.get("/login", auth, (req, res) => {
    if (req.log) return res.redirect("/")
    res.render("login")
})

app.get("*", (req, res) => {
    res.render("notFoundPage")
})

module.exports = app;