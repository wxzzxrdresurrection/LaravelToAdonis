import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules} from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
//import { HttpContext } from "@adonisjs/core/build/standalone";

export default class UsersController {

  public async register({request, response}: HttpContextContract) {

    await request.validate({schema: schema.create({
      name: schema.string({},[
        rules.maxLength(40),
      ]),
      ap_paterno: schema.string({},[
        rules.maxLength(60),
      ]),
      ap_materno: schema.string({},[
        rules.maxLength(60),
      ]),
      telefono: schema.string({},[
        rules.maxLength(10),
        rules.minLength(10),
      ]),
      email: schema.string({},[
        rules.maxLength(100),
        rules.email(),
        rules.unique({table: 'users', column: 'email'}),
      ]), 
      password: schema.string({},[
        rules.minLength(8),
      ]),
    }),messages:{
      required : 'El campo {{field}} es requerido',
      minLength: 'El campo {{field}} debe tener al menos {{options.minLength}} caracteres',
      maxLength: 'El campo {{field}} debe tener como máximo {{options.maxLength}} caracteres',
      'email.unique': 'El correo electrónico ya se encuentra registrado',
      'email.email': 'El correo electrónico no es válido',

    },
  })

  const newUser = User.create({
    name: request.input('name'),
    ap_paterno: request.input('ap_paterno'),
    ap_materno: request.input('ap_materno'),
    telefono: request.input('telefono'),
    email: request.input('email'),
    password: (await Hash.make(request.input('password')))
  })

  if(await (await newUser).save()){
    return response.status(200).json({
      message: 'Usuario registrado correctamente'
    })
  }







  }

}


