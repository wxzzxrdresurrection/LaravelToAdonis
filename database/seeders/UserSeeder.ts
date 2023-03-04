import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Hash from '@ioc:Adonis/Core/Hash'

export default class extends BaseSeeder {
  public async run () {
    await User.createMany([
      {
        name: 'Luis Angel',
        ap_paterno: 'Zapata',
        ap_materno: 'Zuñiga',
        email: 'luiszapata0815@gmail.com',
        password: (await Hash.make('Luis200315')).toString(),
        telefono: '8713530013',
        active: '1',
        rol_id: 1,
      },
      {
        name: 'Carlos Alberto',
        ap_paterno: 'Avalos',
        ap_materno: 'Soto',
        email: 'carlosavs0409@gmail.com',
        password: (await Hash.make('Prueba123')).toString(),
        telefono: '8713321257',
        active: '1',
        rol_id: 2,
      }
    ])

  }
}
