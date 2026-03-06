import { requireAuth } from '~/server/utils/auth'
import { queryOne }    from '~/server/db'
import { ok, fail }    from '~/server/utils/response'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const body = await readBody<{
    name: string; sku: string; price: number; cost: number
    stock: number; category_id: number
  }>(event)

  if (!body.name || !body.sku || !body.category_id) {
    fail('名稱、SKU、分類為必填')
  }

  const exists = await queryOne(`SELECT id FROM products WHERE sku = ?`, [body.sku])
  if (exists) fail('SKU 已存在', 409)

  const result: any = await queryOne(
    `INSERT INTO products (name, sku, price, cost, stock, category_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [body.name, body.sku, body.price ?? 0, body.cost ?? 0, body.stock ?? 0, body.category_id]
  )

  return ok({ id: result.insertId }, '商品建立成功')
})