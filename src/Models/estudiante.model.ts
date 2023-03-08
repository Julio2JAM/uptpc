import {pool} from '../server';
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