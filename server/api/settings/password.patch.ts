import bcrypt          from 'bcryptjs'
import { requireAuth } from '~/server/utils/auth'
import { queryOne }    from '~/server/db'
import { ok, fail }    from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const me   = requireAuth(event)
  const body = await readBody<{
    current_password: string; new_password: string
  }>(event)

  if (!body.current_password || !body.new_password) {
    fail('請填寫所有欄位')
  }
  if (body.new_password.length < 8) {
    fail('新密碼至少 8 個字元')
  }

  const user = await queryOne<{ password: string }>(
    `SELECT password FROM users WHERE id = ?`, [me.userId]
  )

  const valid = await bcrypt.compare(body.current_password, user!.password)
  if (!valid) fail('目前密碼錯誤', 401)

  const hash = await bcrypt.hash(body.new_password, 12)
  await queryOne(`UPDATE users SET password = ? WHERE id = ?`, [hash, me.userId])

  return ok(null, '密碼更新成功')
})