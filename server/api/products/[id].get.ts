import { requireAuth } from '~/server/utils/auth'
import { queryOne }    from '~/server/db'
import { ok }          from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const id = Number(getRouterParam(event, 'id'))
  if (!id) throw createError({ statusCode: 400, message: '無效的 ID' })

  const product = await queryOne(`
    SELECT p.*, c.name AS category
    FROM products p
    JOIN categories c ON c.id = p.category_id
    WHERE p.id = ?
  `, [id])

  if (!product) throw createError({ statusCode: 404, message: '商品不存在' })

  return ok(product)
})