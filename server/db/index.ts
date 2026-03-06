import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

export function getPool(): mysql.Pool {
  if (pool) return pool

  const config = useRuntimeConfig()

  pool = mysql.createPool({
    host:               config.dbHost as string,
    port:               Number(config.dbPort) || 3306,
    user:               config.dbUser as string,
    password:           config.dbPass as string,
    database:           config.dbName as string,
    charset:            'utf8mb4',
    waitForConnections: true,
    connectionLimit:    2,  
    queueLimit:         5,  
    enableKeepAlive:    true,
    keepAliveInitialDelay: 0,
    // 加入 SSL 配置 
    ssl: {
      rejectUnauthorized: false  // Clever Cloud 需要這個設定來接受他們的自簽 SSL 證書
    }
  })

  return pool
}

export async function query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]> {
  try {
    const [rows] = await getPool().query(sql, params)
    return rows as T[]
  } catch (error) {
    console.error('Query error:', error)
    throw error
  }
}

export async function queryOne<T = unknown>(sql: string, params?: unknown[]): Promise<T | null> {
  try {
    const [rows] = await getPool().query(sql, params)
    return ((rows as any[])[0] ?? null) as T | null
  } catch (error) {
    console.error('QueryOne error:', error)
    throw error
  }
}

export async function checkDB(): Promise<boolean> {
  let conn
  try {
    conn = await getPool().getConnection()
    await conn.ping()
    return true
  } catch (error) {
    console.error('Database connection check failed:', error)
    return false
  } finally {
    if (conn) conn.release()
  }
}

export async function testConnection() {
  try {
    const result = await query('SELECT 1 as test')
    return { success: true, data: result }
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message,
      code: error.code
    }
  }
}