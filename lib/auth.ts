import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { User } from '@/types'

const JWT_SECRET = process.env.JWT_SECRET || 'chico-water-secret'

export function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function signToken(payload: { id: string; email: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string }
  } catch {
    return null
  }
}

export function getTokenFromCookies() {
  const cookieStore = cookies()
  return cookieStore.get('auth_token')?.value || null
}

export function getCurrentUser(): { id: string; email: string; role: string } | null {
  const token = getTokenFromCookies()
  if (!token) return null
  return verifyToken(token)
}

export function setAuthCookie(token: string) {
  cookies().set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export function clearAuthCookie() {
  cookies().set('auth_token', '', { maxAge: 0, path: '/' })
}
