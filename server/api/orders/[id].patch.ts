import { requireAuth } from '~/server/utils/auth'
import { queryOne }    from '~/server/db'
import { ok, fail }    from '~/server/utils/response'

const VALID_STATUSES = ['pending','processing','shipped','done','refund','cancelled']

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const id   = Number(getRouterParam(event, 'id'))
  const body = await readBody<{ status?: string; note?: string }>(event)

  if (!id) fail('無效的訂單 ID')

  const updates: string[] = []
  const params: unknown[] = []

  if (body.status) {
    if (!VALID_STATUSES.includes(body.status)) fail('無效的狀態值')
    updates.push('status = ?')
    params.push(body.status)
  }
  if (body.note !== undefined) {
    updates.push('note = ?')
    params.push(body.note)
  }

  if (!updates.length) fail('沒有需要更新的欄位')

  params.push(id)
  await queryOne(
    `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
    params
  )

  const updated = await queryOne(`SELECT * FROM orders WHERE id = ?`, [id])
  return ok(updated, '更新成功')
})