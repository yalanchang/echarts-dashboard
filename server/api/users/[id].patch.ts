import { requireAuth } from '~/server/utils/auth'
import { queryOne }    from '~/server/db'
import { ok, fail }    from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const id   = Number(getRouterParam(event, 'id'))
  const body = await readBody<{ name?: string }>(event)

  if (!id) fail('無效的 ID')
  if (!body.name?.trim()) fail('名字不能為空')

  await queryOne(
    `UPDATE users SET name = ? WHERE id = ?`,
    [body.name!.trim(), id]
  )

  return ok(null, '更新成功')
})