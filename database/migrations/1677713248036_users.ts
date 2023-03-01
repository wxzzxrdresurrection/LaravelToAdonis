import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name',40)
      table.string('ap_paterno',60)
      table.string('ap_materno',60)
      table.string('email',100).unique()
      table.string('password',180)
      table.string('telefono',10)
      table.enum('active', ['1', '0']).defaultTo('0')
      table.integer('codigo').nullable()
      table.integer('rol_id').unsigned().references('roles.id')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
