import { requireAuth } from '~/server/utils/auth'
import { query }       from '~/server/db'
import { ok }          from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const rows = await query(`SELECT id, name FROM categories ORDER BY id`)
  return ok(rows)
})