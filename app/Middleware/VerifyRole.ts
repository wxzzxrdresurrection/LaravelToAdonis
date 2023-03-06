import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VerifyRole {
  public async handle({auth}: HttpContextContract, next: () => Promise<void>, roles: string[]) {
    // code for middleware goes here. ABOVE THE NEXT CALL

    const role = auth.user?.rol_id

    roles.forEach(async (rol) => {
      if (rol === role) {
        await next()
      }
      else {
        return "No tienes permiso para acceder a este recurso"
      }
    })




  }
}
