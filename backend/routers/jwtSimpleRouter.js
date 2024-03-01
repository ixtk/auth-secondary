import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../UserModel.js"

export const jwtSimpleRouter = express.Router()

const JWT_SECRET = "try to guess"

const verifyAccessToken = async (req, res, next) => {
  if (!req.cookies.accessToken) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  jwt.verify(req.cookies.accessToken, JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // ამ user ატრიბუტს გამოვიყენებთ რიგით შემდეგ middleware/response-ებში
    req.user = decoded

    next()
  })
}

jwtSimpleRouter.get("/user/auth", verifyAccessToken, (req, res) => {
  return res.json({ user: req.user })
})

jwtSimpleRouter.get("/secret", verifyAccessToken, (req, res) => {
  return res.json({ secret: "2 x 2 = 4" })
})

jwtSimpleRouter.post("/user/register", async (req, res) => {
  const registerValues = req.body

  const hashedPassword = await bcrypt.hash(registerValues.password, 8)

  const newUser = new User({
    username: registerValues.username,
    email: registerValues.email,
    password: hashedPassword
  })

  await newUser.save()

  const accessToken = jwt.sign(
    { username: newUser.username, email: newUser.email },
    JWT_SECRET,
    {
      expiresIn: "7d"
    }
  )

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  })

  res.status(200).json({
    user: { username: newUser.username, email: newUser.email }
  })
})

jwtSimpleRouter.post("/user/login", async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  const userObj = user.toObject()

  if (user && (await bcrypt.compare(password, userObj.password))) {
    const { password, ...rest } = userObj

    const accessToken = jwt.sign(
      { username: user.username, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "7d"
      }
    )

    await user.save()

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    })

    res.status(200).json({ user: rest })
  } else {
    res.status(401).json({ message: "Invalid username or password" })
  }
})

jwtSimpleRouter.delete("/user/logout", async (req, res) => {
  res.clearCookie("accessToken")
  res.status(200).json({ message: "Logged out" })
})
