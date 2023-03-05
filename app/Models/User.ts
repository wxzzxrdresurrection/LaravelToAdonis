import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public ap_paterno: string

  @column()
  public ap_materno: string

  @column()
  public telefono: string

  @column()
  public email: string

  @column()
  public password: string

  @column()
  public rol_id: number

  @column()
  public active: string

  @column()
  public codigo: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
