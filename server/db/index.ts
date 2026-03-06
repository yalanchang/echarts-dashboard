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
    connectionLimit:    10,
    queueLimit:         0,
  })

  return pool
}

export async function query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]> {
  const result = await getPool().execute(sql, params as any)
  return (result[0] as any[]) as T[]
}

export async function queryOne<T = unknown>(sql: string, params?: unknown[]): Promise<T | null> {
  const result = await getPool().execute(sql, params as any)
  const rows = (result[0] as any[])
  return (rows[0] ?? null) as T | null
}

export async function checkDB(): Promise<boolean> {
  const conn = await getPool().getConnection()
  await conn.ping()
  conn.release()
  return true
}