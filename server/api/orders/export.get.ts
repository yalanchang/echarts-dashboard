import { requireAuth } from '~/server/utils/auth'
import { query }       from '~/server/db'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const rows = await query<any>(`
    SELECT o.order_no, u.name as user_name, u.email,
           o.total, o.status, o.created_at
    FROM orders o
    JOIN users u ON u.id = o.user_id
    ORDER BY o.created_at DESC
  `)

  // 產生 CSV
  const headers = ['訂單編號', '客戶', 'Email', '金額', '狀態', '日期']
  const csv = [
    headers.join(','),
    ...rows.map(r =>
      [r.order_no, r.user_name, r.email, r.total, r.status, r.created_at].join(',')
    )
  ].join('\n')

  setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
  setHeader(event, 'Content-Disposition', 'attachment; filename=orders.csv')

  return csv
})