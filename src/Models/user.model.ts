import AppDataSource from "../database/database"
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({type: String})
    username!: string

    @Column({type: String})
    password!: string

    @Column({type: Number})
    id_status!: number
}

export class UserModel{
    
    async get():Promise<User[]>{
        console.log("getting users");
        return await AppDataSource.manager.find(User);
    }

    async getById(id:Number):Promise<User | null>{
        console.log("getting user by id");
        return await AppDataSource.manager.findOneBy(User,{"id":Number(id)});
    }
    
}

/*import {pool} from '../database/database';
export class EstudianteModel{
    conn:any;
    async get(){
        try{
            this.conn = await pool.getConnection();
            const rows = await this.conn.query('SELECT * FROM estudiante');
            return rows;
        }catch(err){
            console.log(err);
        }finally{
            this.conn.end;
        }
    }
}
*/