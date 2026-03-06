import { requireAuth } from '~/server/utils/auth'
import { queryOne }    from '~/server/db'
import { ok, fail }    from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const id   = Number(getRouterParam(event, 'id'))
  const body = await readBody<Record<string, unknown>>(event)

  if (!id) fail('無效的 ID')

  const allowed = ['name', 'price', 'cost', 'stock', 'is_active']
  const updates: string[] = []
  const params:  unknown[] = []

  for (const key of allowed) {
    if (body[key] !== undefined) {
      updates.push(`${key} = ?`)
      params.push(body[key])
    }
  }

  if (!updates.length) fail('沒有需要更新的欄位')

  params.push(id)
  await queryOne(`UPDATE products SET ${updates.join(', ')} WHERE id = ?`, params)

  return ok(null, '更新成功')
})