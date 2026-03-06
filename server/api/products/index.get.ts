import { requireAuth }     from '~/server/utils/auth'
import { query, queryOne } from '~/server/db'
import { paginated }       from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const q      = getQuery(event)
  const page   = Math.max(1, Number(q.page)  || 1)
  const limit  = Math.min(100, Number(q.limit) || 20)
  const offset = (page - 1) * limit
  const search = q.search as string | undefined

  const conditions: string[] = []
  const params: unknown[] = []

  if (search) {
    conditions.push('(p.name LIKE ? OR p.sku LIKE ?)')
    params.push(`%${search}%`, `%${search}%`)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const rows = await query(`
    SELECT p.id, p.name, p.sku, p.price, p.cost, p.stock, p.is_active,
           c.name AS category
    FROM products p
    JOIN categories c ON c.id = p.category_id
    ${where}
    ORDER BY p.created_at DESC
    LIMIT ? OFFSET ?
  `, [...params, limit, offset])

  const countRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM products p ${where}`, params
  )

  return paginated(rows, countRow?.total ?? 0, page, limit)
})