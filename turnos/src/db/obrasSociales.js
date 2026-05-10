import pool from "./conexion.js";

export default class ObrasSociales {
    
    buscarTodas = async () => {
        const sql = "SELECT * FROM obras_sociales WHERE activo = 1";
        const [obras] = await pool.query(sql);
        return obras;
    }

    buscarPorId = async (id) => {
        const sql = "SELECT * FROM obras_sociales WHERE activo = 1 AND id_obra_social = ?";
        const [obras] = await pool.execute(sql, [id]);
        return obras;
    }

    // A diferencia de especialidades, acá recibimos un objeto con 4 datos
    crear = async (datos) => {
        const { nombre, descripcion, porcentaje_descuento, es_particular } = datos;
        const sql = 'INSERT INTO obras_sociales (nombre, descripcion, porcentaje_descuento, es_particular) VALUES (?, ?, ?, ?)';
        const [resultado] = await pool.execute(sql, [nombre, descripcion, porcentaje_descuento, es_particular]);
        return resultado;
    }

    modificar = async (id, datos) => {
        const { nombre, descripcion, porcentaje_descuento, es_particular } = datos;
        const sql = 'UPDATE obras_sociales SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ? WHERE id_obra_social = ?';
        const [resultado] = await pool.execute(sql, [nombre, descripcion, porcentaje_descuento, es_particular, id]);
        return resultado;
    }

    borrar = async (id) => {
        const sql = 'UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ?';
        const [resultado] = await pool.execute(sql, [id]);
        return resultado;
    }
}