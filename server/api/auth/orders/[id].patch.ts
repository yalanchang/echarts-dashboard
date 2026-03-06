import { requireAdmin }    from '~/server/utils/auth'
import { query, queryOne } from '~/server/db'
import { paginated }       from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const q      = getQuery(event)
  const page   = Math.max(1, Number(q.page)  || 1)
  const limit  = Math.min(100, Number(q.limit) || 20)
  const offset = (page - 1) * limit
  const search = q.search as string | undefined
  const role   = q.role   as string | undefined

  const conditions: string[] = []
  const params: unknown[] = []

  if (search) {
    conditions.push('(name LIKE ? OR email LIKE ?)')
    params.push(`%${search}%`, `%${search}%`)
  }
  if (role) {
    conditions.push('role = ?')
    params.push(role)
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const rows = await query(`
    SELECT id, name, email, role, is_active,
           DATE_FORMAT(last_login,  '%Y-%m-%d %H:%i') AS last_login,
           DATE_FORMAT(created_at,  '%Y-%m-%d')        AS created_at
    FROM users
    ${where}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `, [...params, limit, offset])

  const countRow = await queryOne<{ total: number }>(
    `SELECT COUNT(*) AS total FROM users ${where}`, params
  )

  return paginated(rows, countRow?.total ?? 0, page, limit)
})