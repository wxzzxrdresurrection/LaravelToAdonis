import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules} from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import Route from '@ioc:Adonis/Core/Route'
import Mail from '@ioc:Adonis/Addons/Mail'
import { Request } from '@adonisjs/core/build/standalone'
//import { HttpContext } from "@adonisjs/core/build/standalone";

export default class UsersController {

  public async register({request, response}: HttpContextContract) {

  //VALIDACION DE DATOS
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

  //CREACION DE USUARIO
  const newUser = User.create({
    name: request.input('name'),
    ap_paterno: request.input('ap_paterno'),
    ap_materno: request.input('ap_materno'),
    telefono: request.input('telefono'),
    email: request.input('email'),
    password: (await Hash.make(request.input('password')))
  })


  if(await (await newUser).save()){
    //CREACION DE RUTAS FIRMADAS
    const url = Route.makeSignedUrl('email',{id : (await newUser).id}, {expiresIn: '15m'})
    const url2 = Route.makeSignedUrl('sms',{id : (await newUser).id}, {expiresIn: '15m'})


    //ENVIO DE CORREO (INVESTIGAR JOB O TASK)
    Mail.send(async (message)=>{
      message
      .to((await newUser).email)
      .from('info@api.com')
      .subject('Verificación de correo electrónico')
      .htmlView('emails/welcome',{user: newUser, url: url})

    })

    //RESPUESTA DE LA API
    return response.status(200).json({
      status: 200,
      message: 'Usuario registrado correctamente',
      error: false,
      data : newUser,
      url : url2
    })
  }

  }

  public async verifyEmail({request, response}: HttpContextContract) {

    if(!request.hasValidSignature()){
      return response.status(401).json({
        status: 401,
        message: 'La URL no es válida',
        error: true,
        data : null
      })
    }

    const user = await User.findOrFail(request.input('id'))

    user.codigo = Math.floor(Math.random() * 10000)
    user.save()







  }

}


