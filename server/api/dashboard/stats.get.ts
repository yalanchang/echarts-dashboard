import { requireAuth } from '~/server/utils/auth'
import { query, queryOne } from '~/server/db'
import { ok } from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  // ── 並行查詢所有 KPI ──────────────────────────────────────
  const [revenue, orders, users, refundRate, revenueByMonth, ordersByWeekday] =
    await Promise.all([

      // 本月營收
      queryOne<{ total: number; prev_total: number }>(`
        SELECT
          SUM(CASE WHEN MONTH(created_at) = MONTH(NOW())
                    AND YEAR(created_at)  = YEAR(NOW())
               THEN total ELSE 0 END) AS total,
          SUM(CASE WHEN MONTH(created_at) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH))
                    AND YEAR(created_at)  = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH))
               THEN total ELSE 0 END) AS prev_total
        FROM orders
        WHERE status != 'cancelled'
          AND created_at >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-01')
      `),

      // 本月訂單數
      queryOne<{ count: number; prev_count: number }>(`
        SELECT
          SUM(MONTH(created_at) = MONTH(NOW())
           AND YEAR(created_at) = YEAR(NOW())) AS count,
          SUM(MONTH(created_at) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH))
           AND YEAR(created_at) = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH))) AS prev_count
        FROM orders
        WHERE created_at >= DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 1 MONTH), '%Y-%m-01')
      `),

      // 活躍用戶（30天內登入）
      queryOne<{ count: number }>(`
        SELECT COUNT(*) AS count FROM users
        WHERE last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY)
          AND is_active = 1
      `),

      // 退貨率
      queryOne<{ rate: number }>(`
        SELECT ROUND(
          SUM(status = 'refund') / COUNT(*) * 100, 2
        ) AS rate
        FROM orders
        WHERE MONTH(created_at) = MONTH(NOW())
          AND YEAR(created_at)  = YEAR(NOW())
      `),

      // 近12個月營收（折線圖用）
      query<{ month: string; revenue: number }>(`
        SELECT
          DATE_FORMAT(created_at, '%Y-%m') AS month,
          ROUND(SUM(total), 2)              AS revenue
        FROM orders
        WHERE status = 'done'
          AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
        GROUP BY month
        ORDER BY month ASC
      `),

      // 本週各日訂單量（柱狀圖用）
      query<{ weekday: string; count: number }>(`
        SELECT
          DAYNAME(created_at) AS weekday,
          COUNT(*)            AS count
        FROM orders
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DAYOFWEEK(created_at), weekday
        ORDER BY DAYOFWEEK(created_at)
      `),
    ])

  return ok({
    kpi: {
      revenue:    revenue?.total      ?? 0,
      prevRev:    revenue?.prev_total ?? 0,
      orders:     orders?.count       ?? 0,
      prevOrders: orders?.prev_count  ?? 0,
      activeUsers: users?.count       ?? 0,
      refundRate: refundRate?.rate    ?? 0,
    },
    revenueByMonth,
    ordersByWeekday,
  })
})