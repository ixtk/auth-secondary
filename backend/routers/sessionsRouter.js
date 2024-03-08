import express from "express"
import bcrypt from "bcrypt"
import session from "express-session"
import MongoStore from "connect-mongo"

import { User } from "../UserModel.js"

export const sessionRouter = express.Router()

sessionRouter.use(
  session({
    secret: "super secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 3,
      sameSite: true,
      resave: false,
      saveUninitialized: false
    },
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/auth-demos"
    })
  })
)

export const protectRoute = async (req, res, next) => {
  const { session } = req
  if (!session.userId) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  // ამ user ატრიბუტს გამოვიყენებთ რიგით შემდეგ middleware/response-ებში
  const user = await User.findById(req.session.userId).select("-password")
  req.user = user

  next()
}

sessionRouter.get("/user/auth", protectRoute, async (req, res) => {
  return res.status(200).json({ user: req.user })
})

sessionRouter.get("/secret", protectRoute, (req, res) => {
  return res.json({ secret: "2 x 2 = 4" })
})

sessionRouter.post("/user/register", async (req, res) => {
  const registerValues = req.body

  const hashedPassword = await bcrypt.hash(registerValues.password, 8)

  const newUser = await User.create({
    username: registerValues.username,
    email: registerValues.email,
    password: hashedPassword
  })

  req.session.userId = newUser._id

  res.status(200).json({
    user: { username: newUser.username, email: newUser.email }
  })
})

sessionRouter.post("/user/login", async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }).lean()

  if (user && (await bcrypt.compare(password, user.password))) {
    const { password, ...rest } = user
    req.session.userId = rest._id.toString()
    res.status(200).json({ user: rest })
  } else {
    res.status(401).json({ message: "Invalid username or password" })
  }
})

sessionRouter.delete("/user/logout", async (req, res) => {
  req.session.destroy()
  res.clearCookie("connect.sid")
  res.status(200).json({ message: "Logged out" })
})
