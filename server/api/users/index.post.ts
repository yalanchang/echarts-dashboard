import bcrypt          from 'bcryptjs'
import { requireAdmin } from '~/server/utils/auth'
import { queryOne }     from '~/server/db'
import { ok, fail }     from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody<{
    name: string; email: string; password: string; role?: string
  }>(event)

  if (!body.name || !body.email || !body.password) {
    fail('name、email、password 為必填')
  }

  // 檢查 email 是否重複
  const exists = await queryOne(
    `SELECT id FROM users WHERE email = ?`, [body.email]
  )
  if (exists) fail('Email 已被使用', 409)

  const hash = await bcrypt.hash(body.password, 12)

  const result = await queryOne<{ insertId: number }>(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`,
    [body.name, body.email, hash, body.role ?? 'viewer']
  ) as any

  const newUser = await queryOne(
    `SELECT id, name, email, role, created_at FROM users WHERE id = ?`,
    [result.insertId]
  )

  return ok(newUser, '用戶建立成功')
})