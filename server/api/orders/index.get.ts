import { requireAuth }         from '~/server/utils/auth'
import { query, queryOne }     from '~/server/db'
import { paginated }           from '~/server/utils/response'

interface OrderRow {
  id:         number
  order_no:   string
  user_name:  string
  user_email: string
  total:      number
  status:     string
  note:       string
  created_at: string
}

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const q      = getQuery(event)
  const page   = Math.max(1, Number(q.page)  || 1)
  const limit  = Math.min(100, Number(q.limit) || 20)
  const offset = (page - 1) * limit
  const status = q.status as string | undefined
  const search = q.search as string | undefined

  const conditions: string[] = []
  const params: unknown[] = []

  if (status) {
    conditions.push('o.status = ?')
    params.push(status)
  }
  if (search) {
    conditions.push('(o.order_no LIKE ? OR u.name LIKE ? OR u.email LIKE ?)')
    const like = `%${search}%`
    params.push(like, like, like)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const rows = await query<OrderRow>(`
    SELECT
      o.id, o.order_no, o.total, o.status, o.note,
      DATE_FORMAT(o.created_at, '%Y-%m-%d %H:%i') AS created_at,
      u.name  AS user_name,
      u.email AS user_email
    FROM orders o
    JOIN users u ON u.id = o.user_id
    ${where}
    ORDER BY o.created_at DESC
    LIMIT ? OFFSET ?
  `, [...params, limit, offset])

  const countRow = await queryOne<{ total: number }>(`
    SELECT COUNT(*) AS total
    FROM orders o
    JOIN users u ON u.id = o.user_id
    ${where}
  `, params)

  return paginated(rows, countRow?.total ?? 0, page, limit)
})