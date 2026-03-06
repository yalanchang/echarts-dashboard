import { ok } from '~/server/utils/response'

export default defineEventHandler((event) => {
  deleteCookie(event, 'auth_token')
  return ok(null, '已登出')
})