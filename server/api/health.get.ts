import { checkDB } from '~/server/db'
import { ok }      from '~/server/utils/response'

export default defineEventHandler(async () => {
  const dbOk = await checkDB().catch(() => false)
  return ok({
    status:    dbOk ? 'ok' : 'degraded',
    db:        dbOk,
    timestamp: new Date().toISOString(),
    uptime:    process.uptime(),
  })
})