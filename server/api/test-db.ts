import mysql from 'mysql2/promise'

export default defineEventHandler(async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'bjctbw5lxnk4zzorrjzk-mysql.services.clever-cloud.com',
      user: 'uqb9xz4smqrjsan6',
      password: 'nZsPdKWAw1tNENquLAiS',
      database: 'bjctbw5lxnk4zzorrjzk',
      port: 3306
    })

    const [rows] = await connection.execute('SELECT 1 as test')
    await connection.end()

    return {
      success: true,
      message: 'Database connected!',
      data: rows
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message
    }
  }
})
