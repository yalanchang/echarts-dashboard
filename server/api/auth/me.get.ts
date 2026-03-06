import { requireAuth } from '~/server/utils/auth'
import { queryOne }    from '~/server/db'
import { ok }          from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const { userId } = requireAuth(event)

  const user = await queryOne<{
    id: number; name: string; email: string; role: string; last_login: string
  }>(
    `SELECT id, name, email, role, last_login FROM users WHERE id = ? AND is_active = 1`,
    [userId]
  )

  if (!user) throw createError({ statusCode: 404, message: '用戶不存在' })

  return ok(user)
})