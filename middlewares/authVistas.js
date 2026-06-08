import jwt from 'jsonwebtoken';

// 1. Carga el usuario en res.locals para que Handlebars lo vea
export const cargarUsuarioVista = (req, res, next) => {
    // Busca la cookie que llamaremos 'jwt'
    const token = req.cookies?.jwt;

    if (token) {
        try {
            // Decodifica el token usando tu palabra secreta del .env
            const decodificado = jwt.verify(token, process.env.JWT_SECRET);

            // 🔥 LA MAGIA: res.locals hace que la variable 'usuario' esté disponible 
            // automáticamente en TODOS los archivos .hbs (como en tu navbar)
            res.locals.usuario = decodificado;
        } catch (error) {
            // Si el token venció o es trucho, lo borramos
            res.clearCookie('jwt');
            res.locals.usuario = null;
        }
    } else {
        res.locals.usuario = null;
    }
    next();
};

// 2. Protege las rutas y patea a los que no tienen permiso
export const requerirRolVistas = (rolesPermitidos) => {
    return (req, res, next) => {
        const usuario = res.locals.usuario; // Lo leemos de la magia anterior

        // Si no está logueado, lo mandamos al login
        if (!usuario) {
            return res.redirect('/login');
        }

        // Si está logueado pero su número de rol no está en la lista permitida
        if (!rolesPermitidos.includes(usuario.rol)) {
            // Podrías mandarlo a una vista de error 403, por ahora lo mandamos al inicio
            return res.redirect('/');
        }

        next(); // Tiene permiso, que pase
    };
};