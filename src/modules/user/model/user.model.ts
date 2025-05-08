import { Column, DataType,  Model, Table } from "sequelize-typescript";

@Table({ tableName: "users",timestamps:true })
export class User extends Model {
    @Column({type:DataType.TEXT})
    name: string

    @Column({type:DataType.TEXT,unique:true})
    email: string

    @Column({type:DataType.SMALLINT})
    age: number

    @Column({type:DataType.TEXT})
    password: string

    @Column({type:DataType.TEXT})
    image?: string
}