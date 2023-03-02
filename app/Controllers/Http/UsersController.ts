import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules} from '@ioc:Adonis/Core/Validator'
//import { HttpContext } from "@adonisjs/core/build/standalone";

export default class UsersController {

  public async register({request, response}: HttpContextContract) {

    await request.validate({

      schema: schema.create({

        name: schema.string({},[
          rules.required(),
          rules.maxLength(40)
        ]),
        ap_paterno: schema.string({},[
          rules.required(),
          rules.maxLength(60)
        ]),
        ap_materno: schema.string({},[
          rules.required(),
          rules.maxLength(60)
        ]),
        telefono: schema.string({},[
          rules.required(),
          rules.maxLength(10)
        ]),
        email: schema.string({},[
          rules.unique({table: 'users', column: 'email'}),
          rules.required(),
          rules.email(),
          rules.maxLength(100)
        ]),
        password: schema.string({},[
          rules.required(),
          rules.minLength(8)
        ])
      }),
      messages:{
        required: 'El campo {{field}} es requerido para registrarse ',
        'email.unique': 'El correo electrónico ya se encuentra registrado',
        'email.email': 'El correo electrónico no es válido',
        maxLength: 'El campo {{field}} no puede tener más de {{options.maxLength}} caracteres',
        minLength: 'El campo {{field}} debe tener al menos {{options.minLength}} caracteres'
      },
      
    })



  }

}
