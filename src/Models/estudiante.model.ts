import {pool} from '../server';

export class EstudianteModel{
    async get(){
        let conn;
        try{
            conn = await pool.getConnection();
            const rows = await conn.query('SELECT * FROM estudiante');
            return rows;
        }catch(err){
            throw err;
        }finally{
            if(conn) return conn.end;
        }
    }
}