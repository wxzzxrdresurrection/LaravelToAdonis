import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'carreras'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nombre',50)
      table.timestamps(true,true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
