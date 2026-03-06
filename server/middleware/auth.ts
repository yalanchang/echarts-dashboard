import { getAuthUser } from '~/server/utils/auth'
import { defineEventHandler, getRequestURL, createError } from 'h3'

export default defineEventHandler((event) => {
  const url = getRequestURL(event).pathname

  if (!url.startsWith('/api/admin/')) return

  const user = getAuthUser(event)
  if (!user) {
    throw createError({ statusCode: 401, message: '未授權，請先登入' })
  }

  event.context.user = user
})