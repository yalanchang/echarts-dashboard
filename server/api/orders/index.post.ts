import { requireAuth } from '~/server/utils/auth'
import { queryOne }    from '~/server/db'
import { ok, fail }    from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const body = await readBody<{
    user_id: number; note?: string; status?: string
  }>(event)

  if (!body.user_id) fail('請選擇客戶')

  const orderNo = 'ORD-' + Date.now()

  const result: any = await queryOne(
    `INSERT INTO orders (user_id, order_no, total, status, note)
     VALUES (?, ?, 0, ?, ?)`,
    [body.user_id, orderNo, body.status ?? 'pending', body.note ?? '']
  )

  return ok({ order_no: orderNo }, '訂單建立成功')
})