import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VerifyActive {
  public async handle({auth,response}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    if(auth.user?.active === '0'){

      return response.status(401).json({
        message: 'Usuario no activo'
      })

    }


    await next()
  }
}
