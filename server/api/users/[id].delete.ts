import { requireAdmin } from '~/server/utils/auth'
import { queryOne }     from '~/server/db'
import { ok, fail }     from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  const me = requireAdmin(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!id) fail('無效的 ID')
  if (id === me.userId) fail('不能刪除自己', 403)

  // 軟刪除 (is_active = 0)
  await queryOne(`UPDATE users SET is_active = 0 WHERE id = ?`, [id])

  return ok(null, '用戶已停用')
})