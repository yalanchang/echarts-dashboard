import { requireAuth }     from '~/server/utils/auth'
import { queryOne, query } from '~/server/db'
import { ok }              from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: '無效的訂單 ID' })

  const order = await queryOne<Record<string, unknown>>(`
    SELECT
      o.*,
      u.name  AS user_name,
      u.email AS user_email
    FROM orders o
    JOIN users u ON u.id = o.user_id
    WHERE o.id = ?
  `, [id])

  if (!order) throw createError({ statusCode: 404, message: '訂單不存在' })

  // 訂單明細
  const items = await query<Record<string, unknown>>(`
    SELECT
      oi.id, oi.qty, oi.unit_price, oi.subtotal,
      p.name AS product_name,
      p.sku
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ?
  `, [id])

  return ok({ ...order, items })
})