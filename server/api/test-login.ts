import mysql from 'mysql2/promise'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('1. 收到請求:', body)
    
    // 直接連線
    const connection = await mysql.createConnection({
      host: 'bjctbw5lxnk4zzorrjzk-mysql.services.clever-cloud.com',
      user: 'uqb9xz4smqrjsan6',
      password: 'nZsPdKWAw1tNENquLAiS',
      database: 'bjctbw5lxnk4zzorrjzk',
      port: 3306
    })
    console.log('2. 資料庫連線成功')

    const [rows] = await connection.execute(
      'SELECT id, email, role FROM users WHERE email = ?',
      [body.email]
    )
    console.log('3. 查詢完成')

    await connection.end()

    return {
      success: true,
      message: '測試成功',
      data: rows
    }
  } catch (error: any) {
    console.error('錯誤:', error)
    return {
      success: false,
      error: error.message
    }
  }
})
