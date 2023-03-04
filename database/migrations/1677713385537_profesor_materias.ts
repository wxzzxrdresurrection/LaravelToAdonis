import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'profesor_materia'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('profesor_id').unsigned().references('profesores.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.integer('materia_id').unsigned().references('materias.id').onDelete('CASCADE').onUpdate('CASCADE')
      table.timestamps(true,true)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
