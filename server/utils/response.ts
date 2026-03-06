
export interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    message?: string
    pagination?: {
      page:       number
      limit:      number
      total:      number
      totalPages: number
    }
  }
  
  export function ok<T>(data: T, message?: string): ApiResponse<T> {
    return { success: true, data, message }
  }
  
  export function paginated<T>(
    data:  T[],
    total: number,
    page:  number,
    limit: number
  ): ApiResponse<T[]> {
    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
  
  export function fail(message: string, statusCode = 400): never {
    throw createError({ statusCode, message })
  }