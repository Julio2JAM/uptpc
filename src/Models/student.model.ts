//import AppDataSource from "../database/database"
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class student {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: 'int', nullable: false, width: 3})
    cedule!: number

    @Column({ type: 'varchar', nullable: true, length: 60})
    name!: string

    @Column({ type: 'varchar', nullable: true, length: 60})
    lastName!: string

    @Column({ type: 'varchar', nullable: true, length: 14})
    phone!: string

    @Column({ type: 'varchar', nullable: true, length: 60})
    email!: string

    @Column({ type: 'date' })
    birthday!: Date

    @Column({ type: 'date' })
    datetime!: Date

    @Column({ type: 'tinyint', width: 2, default: 1, nullable: false})
    status!: number

    /*constructor(username: string, password: string) {
        this.username = username;
        this.password = password;
        this.id_status = 1;
    }*/
}
/*
export class UserModel{
    
    async get():Promise<User[]>{
        console.log("getting users");
        return await AppDataSource.manager.find(User);
    }

    async getById(id:Number):Promise<User | null>{
        console.log("getting user by id");
        return await AppDataSource.manager.findOneBy(User,{"id":Number(id)});
    }
    
    async create(user:User):Promise<User>{
        console.log("creating a new user");
        return await AppDataSource.manager.save(User,user);
    }
}*/