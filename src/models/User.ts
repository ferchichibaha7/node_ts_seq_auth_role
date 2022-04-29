import { Table, Column, Model, HasMany } from 'sequelize-typescript'

@Table
export class User extends Model {
  @Column
  name: string

  @Column
  password: string


}