import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../config/prisma.js'
import { env } from '../config/env.js'

const SALT_ROUNDS = 10

export const hashPassword = password => {
  return bcrypt.hash(password, SALT_ROUNDS)
}

export const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash)
}

export const generateToken = user => {
  return jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  })
}

export const verifyToken = token => {
  return jwt.verify(token, env.JWT_SECRET)
}

export const register = async userData => {
  const { email, username, password, role } = userData

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  })

  if (existingUser) {
    const error = new Error(
      existingUser.email === email
        ? 'Cet email est déjà utilisé'
        : "Ce nom d'utilisateur est déjà pris"
    )
    error.status = 400
    throw error
  }

  const hashedPassword = await hashPassword(password)

  const user = await prisma.user.create({
    data: {
      email,
      username,
      password: hashedPassword,
      ...(role && { role }),
    },
  })

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export const login = async (email, password) => {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    const error = new Error('Email ou mot de passe incorrect')
    error.status = 400
    throw error
  }

  const isValid = await comparePassword(password, user.password)

  if (!isValid) {
    const error = new Error('Email ou mot de passe incorrect')
    error.status = 400
    throw error
  }

  const token = generateToken(user)
  const { password: _, ...userWithoutPassword } = user

  return { user: userWithoutPassword, token }
}

export const getUserById = async id => {
  const user = await prisma.user.findUnique({
    where: { id },
  })

  if (!user) {
    const error = new Error('Utilisateur non trouvé')
    error.status = 404
    throw error
  }

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}
