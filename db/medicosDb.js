import pool from "./conexion.js";

export default class Medicos {

    buscarTodos = async () => {
        const sql = "SELECT * FROM medicos m INNER JOIN usuarios u ON m.id_usuario = u.id_usuario WHERE u.activo = 1";
        const [medicos] = await pool.query(sql);
        return medicos;
    }

    buscarPorId = async (id) => {
        const sql = "SELECT * FROM medicos m INNER JOIN usuarios u ON m.id_usuario = u.id_usuario WHERE u.activo = 1 AND m.id_medico = ?";
        const [medicos] = await pool.execute(sql, [id]);
        return medicos;
    }

    crear = async (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) => {
        const sql = "INSERT INTO medicos (id_usuario, id_especialidad, matricula, descripcion, valor_consulta) VALUES (?, ?, ?, ?, ?)";
        const [resultado] = await pool.execute(sql, [id_usuario, id_especialidad, matricula, descripcion, valor_consulta]);
        return resultado;
    }

    modificar = async (id, matricula, descripcion, valor_consulta) => {
        const sql = "UPDATE medicos SET matricula = ?, descripcion = ?, valor_consulta = ? WHERE id_medico = ?";
        const [resultado] = await pool.execute(sql, [ matricula, descripcion, valor_consulta, id]);
        return resultado;
    }

    relacionarConObraSocial = async (id_medico, obras_sociales) => {
        const conexion = await pool.getConnection();
        try {
            await conexion.beginTransaction();

            for(const os of obras_sociales){
                const sql = "INSERT INTO medicos_obras_sociales (id_medico, id_obra_social) VALUES (?, ?);"
                await conexion.execute(sql, [id_medico, os.id_obra_social]);

            }

            await conexion.commit();
            await conexion.release();
            return true;
            
        } catch (error) {
            await conexion.rollback();
            await conexion.release();
            console.log(error);
            return false;
            
        }
    }

    borrar = async (id_usuario) => {
        const sql = "UPDATE usuarios SET activo = 0 WHERE id_usuario = ?";
        const [resultado] = await pool.execute(sql, [id_usuario]);
        return resultado;
    }
} 