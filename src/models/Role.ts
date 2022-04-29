import { Table, Column, Model, HasMany } from 'sequelize-typescript'

@Table
export class Role extends Model {
  @Column
  name: string



}