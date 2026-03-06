import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    const hash = '$2a$12$KIFnAqBKAMwFHrpxl3xKYuXxv2FqO6kP4qL9RHyoG5AxGldAuJMGa'
    const isValid = bcrypt.compareSync(body.password, hash)
    
    return {
      success: true,
      input: body.password,
      hash: hash,
      isValid: isValid,
      newHash: bcrypt.hashSync('11111111', 12)
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})
