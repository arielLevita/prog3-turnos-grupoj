import pool from './conexion.js';

async function testConexion() {
    try {
        const con = await pool.getConnection();
        console.log("Base de Datos conectada correctamente");

        const [resulst] = await con.query("SELECT NOW() AS hora_servidor, DATABASE() AS base_datos");
        console.log("Base de Datos:");    
        console.log(resulst);

        con.release();
    } catch (error) {
        console.log("Error al conectarse a la base de datos", error);
        console.error({
            codigo: error.code,
            msg: error.message
        });
        process.exit(1);
    }
}

export default testConexion;