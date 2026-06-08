// Buscá donde tenés la configuración de Handlebars y dejala exactamente así:

app.engine('.hbs', engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: join(__dirname, 'views/layouts'),
    partialsDir: join(__dirname, 'views/partials'),

    // ACÁ ARRANCAN LOS HELPERS
    helpers: {
        // Compara si dos valores son iguales (ideal para los roles)
        eq: (a, b) => a == b, // Usamos == por si uno es número y otro texto

        // Compara si dos valores son distintos
        ne: (a, b) => a != b,

        // Formatea la fecha de la base de datos a dd/mm/yyyy hh:mm
        formatearFecha: (fecha) => {
            if (!fecha) return 'Fecha no disponible';
            const d = new Date(fecha);
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const anio = d.getFullYear();
            const horas = String(d.getHours()).padStart(2, '0');
            const min = String(d.getMinutes()).padStart(2, '0');
            return `${dia}/${mes}/${anio} ${horas}:${min}`;
        },

        // Convierte un número (ej: 1500.5) en formato moneda (1.500,50)
        formatearMoneda: (valor) => {
            if (valor === null || valor === undefined) return '0.00';
            // Usamos el formato de Argentina
            return Number(valor).toLocaleString('es-AR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        },

        // Devuelve un cartelito HTML (badge) según el estado del turno
        estadoTurno: (atendido) => {
            if (atendido) {
                return '<span class="badge bg-success">✅ Atendido</span>';
            }
            return '<span class="badge bg-warning text-dark">⏳ Pendiente</span>';
        }
    }
}));