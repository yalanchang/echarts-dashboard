import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'

export interface JwtPayload {
  userId: number
  email: string
  role: string
}

export function signToken(payload: JwtPayload): string {
  const config = useRuntimeConfig()
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' })
}

export function verifyToken(token: string): JwtPayload {
  const config = useRuntimeConfig()
  return jwt.verify(token, config.jwtSecret) as JwtPayload
}

/**
 * 從 Authorization header 或 Cookie 取得使用者
 */
export function getAuthUser(event: H3Event): JwtPayload | null {
  try {
    const header = getHeader(event, 'authorization') ?? ''
    const token  = header.startsWith('Bearer ')
      ? header.slice(7)
      : getCookie(event, 'auth_token') ?? ''

    if (!token) return null
    return verifyToken(token)
  } catch {
    return null
  }
}

/**
 * 必須登入的路由守衛
 */
export function requireAuth(event: H3Event): JwtPayload {
  const user = getAuthUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: '請先登入' })
  }
  return user
}

/**
 * 必須是 Admin
 */
export function requireAdmin(event: H3Event): JwtPayload {
  const user = requireAuth(event)
  if (user.role !== 'admin') {
    throw createError({ statusCode: 403, message: '權限不足' })
  }
  return user
}