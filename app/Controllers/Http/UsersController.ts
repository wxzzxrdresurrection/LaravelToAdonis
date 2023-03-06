import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules} from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'
import Route from '@ioc:Adonis/Core/Route'
import Mail from '@ioc:Adonis/Addons/Mail'
const { Vonage } = require('@vonage/server-sdk')

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

    //MANDAR MENSAJE DE TEXTO CON CODIGO
    const vonage = new Vonage({
      apiKey: "a72cb7d2",
      apiSecret: "JTOM8ZOCLTfcjeaH"
    })
    const from = "Vonage APIs"
    const to = "52" + user.telefono
    const text = 'Tu código de verificación es: ' + user.codigo.toString()

    await vonage.sms.send({to, from, text})

    //REGRESAR UNA VISTA
    //return

  }

  public async verifyCode({request, response}: HttpContextContract) {

    if(!request.hasValidSignature()){
      return response.status(401).json({
        status: 401,
        message: 'La URL no es válida',
        error: true,
        data : null
      })
    }

    await request.validate({schema: schema.create({

      codigo: schema.string()
      }),
      messages:{
        required : 'El campo {{field}} es requerido',
      }
    })


    const user = await User.find(request.param('id'))

    if(!user){
      return response.status(400).json({
        status: 400,
        message: 'El usuario no existe',
        error: true,
        data : null
      })
    }

    if(request.input('codigo') == user.codigo){
      user.active = '1'
      user.save()
      return response.status(200).json({
        status: 200,
        message: 'Usuario activado correctamente',
        error: false,
        data : user
      })
    }

    return response.status(400).json({
      status: 400,
      message: 'Error al activar usuario',
      error: true,
      data : null
    })

  }

  public async login({request, response, auth}: HttpContextContract) {

    await request.validate({schema: schema.create({
        email: schema.string({},[
          rules.email(),
        ]),
        password: schema.string({},[
          rules.minLength(8),
        ]),
      }),messages:{
        required : 'El campo {{field}} es requerido',
        minLength: 'El campo {{field}} debe tener al menos {{options.minLength}} caracteres',
        'email.email': 'El correo electrónico no es válido',
      },
    })

    const user = await User.findBy('email', request.input('email'))

    if(!user || !(await Hash.verify(user.password, request.input('password')))){
      return response.status(400).json({
        status: 400,
        message: 'Credenciales de usuario incorrectas',
        error: true,
        data : null
      })
    }

    const token = await auth.use('api').generate(user)
    return response.status(200).json({
        status: 200,
        message: 'Usuario autenticado correctamente',
        error: null,
        data : user,
        token : token
    })


  }

  public async logout({response, auth}: HttpContextContract) {

    await auth.use('api').revoke()

    return response.status(200).json({
      status: 200,
      message: 'Sesión cerrada correctamente',
      error: null,
      data : null
    })

  }

}


