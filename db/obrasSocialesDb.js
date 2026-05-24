import pool from "./conexion.js";

export default class ObrasSociales {

    buscarTodas = async () => {
        const sql = "SELECT * FROM obras_sociales WHERE activo = 1";
        const [obrasSociales] = await pool.query(sql);
        return obrasSociales;
    }

    buscarPorId = async (id) => {
        const sql = "SELECT * FROM obras_sociales WHERE activo = 1 AND id_obra_social = ?";
        const [obrasSociales] = await pool.execute(sql, [id]);
        return obrasSociales;
    }

    crear = async (nombre, descripcion, porcentaje_descuento, es_particular) => {
        const sql = "INSERT INTO obras_sociales (nombre, descripcion, porcentaje_descuento, es_particular ) VALUES (?, ?, ?, ?)";
        const [resultado] = await pool.execute(sql, [nombre, descripcion, porcentaje_descuento, es_particular]);
        return resultado;
    }

    modificar = async (id, nombre, descripcion, porcentaje_descuento, es_particular ) => {
        const sql = "UPDATE obras_sociales SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ? WHERE id_obra_social = ?";
        const [resultado] = await pool.execute(sql, [ nombre, descripcion, porcentaje_descuento, es_particular, id]);
        return resultado;
    }

    borrar = async (id) => {
        const sql = "UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ?";
        const [resultado] = await pool.execute(sql, [id]);
        return resultado;
    }
} 