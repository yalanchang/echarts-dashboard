import { requireAuth } from '~/server/utils/auth'
import { query }       from '~/server/db'
import { ok }          from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const q = getQuery(event)
  const year = Number(q.year) || new Date().getFullYear()

  // 月營收
  const monthly = await query<{ month: string; revenue: number; orders: number }>(`
    SELECT
      DATE_FORMAT(created_at, '%Y-%m')  AS month,
      ROUND(SUM(total), 2)              AS revenue,
      COUNT(*)                          AS orders
    FROM orders
    WHERE status = 'done'
      AND YEAR(created_at) = ?
    GROUP BY month
    ORDER BY month ASC
  `, [year])

  // 品類佔比（餅圖）
  const byCategory = await query<{ category: string; revenue: number }>(`
    SELECT
      c.name                AS category,
      ROUND(SUM(oi.subtotal), 2) AS revenue
    FROM order_items oi
    JOIN products p    ON p.id = oi.product_id
    JOIN categories c  ON c.id = p.category_id
    JOIN orders o      ON o.id = oi.order_id
    WHERE o.status = 'done'
      AND YEAR(o.created_at) = ?
    GROUP BY c.id, c.name
    ORDER BY revenue DESC
  `, [year])

  // 用戶來源（模擬欄位，實際可新增 source 欄位）
  const userSource = await query<{ source: string; count: number }>(`
    SELECT 'organic' AS source, COUNT(*) AS count FROM users
    WHERE YEAR(created_at) = ?
    UNION ALL
    SELECT 'social', FLOOR(COUNT(*) * 0.4) FROM users WHERE YEAR(created_at) = ?
    UNION ALL
    SELECT 'ads',    FLOOR(COUNT(*) * 0.2) FROM users WHERE YEAR(created_at) = ?
    LIMIT 4
  `, [year, year, year])

  return ok({ monthly, byCategory, userSource })
})