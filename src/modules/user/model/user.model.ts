import { Column, DataType, Model, Table } from "sequelize-typescript";
import { UserRole } from "../enums";

@Table({ tableName: "users", timestamps: true })
export class User extends Model {
    @Column({ type: DataType.TEXT })
    name: string

    @Column({ type: DataType.TEXT, unique: true })
    email: string

    @Column({ type: DataType.SMALLINT })
    age: number

    @Column({ type: DataType.TEXT })
    password: string

    @Column({ type: DataType.TEXT })
    image?: string

    @Column({
        type: DataType.ENUM,
        values: Object.values(UserRole),
        defaultValue: UserRole.USER
    })
    role: UserRole
}