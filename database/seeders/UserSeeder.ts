import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
export default class extends BaseSeeder {
  public async run () {
    await User.createMany([
      {
        name: 'Luis Angel',
        ap_paterno: 'Zapata',
        ap_materno: 'Zuñiga',
        email: 'luiszapata0815@gmail.com',
        password:'Luis200315',
        telefono: '8713530013',
        active: '1',
        role_id: 1,
      },
      {
        name: 'Carlos Alberto',
        ap_paterno: 'Avalos',
        ap_materno: 'Soto',
        email: 'carlosavs0409@gmail.com',
        password:'Prueba123',
        telefono: '8713321257',
        active: '1',
        role_id: 2,
      }
    ])

  }
}
