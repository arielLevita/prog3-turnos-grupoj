import { Router } from 'express';
// Importamos el middleware que protege las vistas
import { requerirRolVistas } from '../../middlewares/authVistas.js';

// Importamos los servicios (clases)
import EspecialidadesServicio from '../../servicios/especialidadesServicio.js';
import MedicosServicio from '../../servicios/medicosServicio.js';
import PacientesServicio from '../../servicios/pacientesServicio.js';
import ObrasSocialesServicio from '../../servicios/obrasSocialesServicio.js';
import TurnosServicio from '../../servicios/turnosServicio.js';

// Instanciamos los servicios
const especialidadesServicio = new EspecialidadesServicio();
const medicosServicio = new MedicosServicio();
const pacientesServicio = new PacientesServicio();
const obrasSocialesServicio = new ObrasSocialesServicio();
const turnosServicio = new TurnosServicio();

const router = Router();

// ==========================================
// 🔓 RUTAS PÚBLICAS (Login)
// ==========================================
router.get('/login', (req, res) => {
    // Le avisamos que use el layout de 'auth' sin la barra de navegación
    res.render('login', { layout: 'auth' });
});

// ==========================================
// 👨⚕️ RUTAS DEL MÉDICO (Solo ROL 1)
// ==========================================
router.get('/medico/turnos', requerirRolVistas([1]), async (req, res) => {
    try {
        const usuario = res.locals.usuario;
        const turnos = await turnosServicio.buscarTodas(usuario);
        res.render('medico/turnos', { turnos });
    } catch (error) {
        console.error("Error al cargar la vista:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// ==========================================
// 👤 RUTAS DEL PACIENTE (Solo ROL 2)
// ==========================================
router.get('/paciente/especialidades', requerirRolVistas([2]), async (req, res) => {
    try {
        const especialidades = await especialidadesServicio.buscarTodas();
        res.render('paciente/especialidades', { especialidades });
    } catch (error) {
        console.error("Error al cargar la vista:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get('/paciente/medicos', requerirRolVistas([2]), async (req, res) => {
    try {
        const medicos = await medicosServicio.buscarTodas();
        const especialidades = await especialidadesServicio.buscarTodas();
        res.render('paciente/medicos', { medicos, especialidades });
    } catch (error) {
        console.error("Error al cargar la vista:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get('/paciente/reservar', requerirRolVistas([2]), async (req, res) => {
    try {
        const medicos = await medicosServicio.buscarTodas();
        res.render('paciente/reservar', { medicos });
    } catch (error) {
        console.error("Error al cargar la vista:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get('/paciente/turnos', requerirRolVistas([2]), async (req, res) => {
    try {
        const usuario = res.locals.usuario;
        const turnos = await turnosServicio.buscarTodas(usuario);
        res.render('paciente/turnos', { turnos });
    } catch (error) {
        console.error("Error al cargar la vista:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// ==========================================
// ⚙️ RUTAS DEL ADMINISTRADOR (Solo ROL 3)
// ==========================================
router.get('/admin/especialidades', requerirRolVistas([3]), async (req, res) => {
    try {
        const especialidades = await especialidadesServicio.buscarTodas();
        res.render('admin/especialidades', { especialidades });
    } catch (error) {
        console.error("Error al cargar la vista:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get('/admin/obras-sociales', requerirRolVistas([3]), async (req, res) => {
    try {
        const obrasSociales = await obrasSocialesServicio.buscarTodas();
        res.render('admin/obras-sociales', { obrasSociales });
    } catch (error) {
        console.error("Error al cargar la vista:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get('/admin/medicos', requerirRolVistas([3]), async (req, res) => {
    try {
        const medicos = await medicosServicio.buscarTodas();
        res.render('admin/medicos', { medicos });
    } catch (error) {
        console.error("Error al cargar la vista:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get('/admin/asociaciones', requerirRolVistas([3]), async (req, res) => {
    try {
        const medicos = await medicosServicio.buscarTodas();
        const pacientes = await pacientesServicio.buscarTodas();
        const obrasSociales = await obrasSocialesServicio.buscarTodas();
        res.render('admin/asociaciones', { medicos, pacientes, obrasSociales });
    } catch (error) {
        console.error("Error al cargar la vista:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get('/admin/turnos', requerirRolVistas([3]), async (req, res) => {
    try {
        const usuario = res.locals.usuario;
        const pacientes = await pacientesServicio.buscarTodas();
        const medicos = await medicosServicio.buscarTodas();
        const turnos = await turnosServicio.buscarTodas(usuario);
        res.render('admin/turnos', { pacientes, medicos, turnos });
    } catch (error) {
        console.error("Error al cargar la vista:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get('/admin/estadisticas', requerirRolVistas([3]), async (req, res) => {
    try {
        res.render('admin/estadisticas', { estadisticas: [] });
    } catch (error) {
        console.error("Error al cargar la vista:", error);
        res.status(500).send("Error interno del servidor");
    }
});

export default router;
