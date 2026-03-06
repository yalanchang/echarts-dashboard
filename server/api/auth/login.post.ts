import bcrypt from 'bcryptjs'
import { queryOne } from '~/server/db'
import { signToken } from '~/server/utils/auth'
import { ok, fail } from '~/server/utils/response'

interface UserRow {
  id:       number
  name:     string
  email:    string
  password: string
  role:     string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{ email: string; password: string }>(event)

    if (!body?.email || !body?.password) {
      return fail('請輸入帳號與密碼', 400)  
    }

    const user = await queryOne<UserRow>(
      `SELECT id, name, email, password, role
       FROM users
       WHERE email = ? AND is_active = 1
       LIMIT 1`,
      [body.email]
    )

    if (!user) {
      return fail('帳號或密碼錯誤', 401)  // 加 return
    }

    const valid = await bcrypt.compare(body.password, user.password)
    if (!valid) {
      return fail('帳號或密碼錯誤', 401)  // 加 return
    }

    await queryOne(
      `UPDATE users SET last_login = NOW() WHERE id = ?`,
      [user.id]
    )

    const token = signToken({
      userId: user.id,
      email:  user.email,
      role:   user.role,
    })

    setCookie(event, 'auth_token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      maxAge:   60 * 60 * 24 * 7,
      sameSite: 'lax',
      path:     '/'
    })

    return ok({
      token,
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    }, '登入成功')

  } catch (error: any) {
    console.error('登入錯誤:', error)
    return fail(error.message || '伺服器錯誤', 500)
  }
})