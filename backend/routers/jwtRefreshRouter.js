import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { User } from "../UserModel.js"

export const jwtRefreshRouter = express.Router()

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

jwtRefreshRouter.get("/user/auth", verifyAccessToken, (req, res) => {
  return res.json({ user: req.user })
})

jwtRefreshRouter.get("/secret", verifyAccessToken, (req, res) => {
  return res.json({ secret: "2 x 2 = 4" })
})

jwtRefreshRouter.post("/user/register", async (req, res) => {
  const registerValues = req.body

  const hashedPassword = await bcrypt.hash(registerValues.password, 8)

  const newUser = new User({
    username: registerValues.username,
    email: registerValues.email,
    password: hashedPassword
  })

  const accessToken = jwt.sign(
    { username: newUser.username, email: newUser.email },
    JWT_SECRET,
    {
      expiresIn: "5m"
    }
  )

  const refreshToken = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
    expiresIn: "7d"
  })

  newUser.refreshToken = refreshToken
  await newUser.save()

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 1000 * 60 * 5
  })

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7
  })

  res.status(200).json({
    user: { username: newUser.username, email: newUser.email }
  })
})

jwtRefreshRouter.post("/user/login", async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  const userObj = user.toObject()

  if (user && (await bcrypt.compare(password, userObj.password))) {
    const { password, ...rest } = userObj

    const accessToken = jwt.sign(
      { username: user.username, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "5m"
      }
    )

    const refreshToken = jwt.sign({ userId: rest._id }, JWT_SECRET, {
      expiresIn: "7d"
    })

    user.refreshToken = refreshToken
    await user.save()

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7
    })

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 1000 * 60 * 5
    })

    res.status(200).json({ user: rest })
  } else {
    res.status(401).json({ message: "Invalid username or password" })
  }
})

jwtRefreshRouter.post("/refresh", async (req, res) => {
  const { refreshToken } = req.cookies

  if (!refreshToken) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  jwt.verify(refreshToken, JWT_SECRET, async (error, decoded) => {
    if (error) {
      res.clearCookie("refreshToken")
      return res.status(401).json({ message: "Unauthorized" })
    }

    const user = await User.findById(decoded.userId)

    if (!user || !user.refreshToken) {
      res.clearCookie("refreshToken")
      return res.status(401).json({ message: "Unauthorized" })
    }

    const accessToken = jwt.sign(
      { username: user.username, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "5m"
      }
    )

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 1000 * 60 * 5
    })

    res
      .status(200)
      .json({ user: { username: user.username, email: user.email } })
  })
})

jwtRefreshRouter.delete("/user/logout", async (req, res) => {
  const { refreshToken } = req.cookies

  const user = await User.findOne({ refreshToken })

  if (user) {
    user.refreshToken = null
    await user.save()
  }

  res.clearCookie("accessToken")
  res.clearCookie("refreshToken")
  res.status(200).json({ message: "Logged out" })
})
