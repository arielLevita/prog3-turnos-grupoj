export const mensajesFlash = (req, res, next) => {
    // 1. Leemos si hay mensajes guardados en las cookies y se los pasamos a Handlebars
    res.locals.mensajeExito = req.cookies.mensajeExito;
    res.locals.mensajeError = req.cookies.mensajeError;

    // 2. Borramos las cookies apenas las leemos (así el cartel no vuelve a aparecer si el usuario recarga la página)
    if (req.cookies.mensajeExito) res.clearCookie('mensajeExito');
    if (req.cookies.mensajeError) res.clearCookie('mensajeError');

    // 3. Le agregamos un "superpoder" a 'res' para que puedas redirigir y mandar un mensaje al mismo tiempo
    res.redirectConMensaje = (url, tipo, mensaje) => {
        // Guarda la cookie por solo 5 segundos (suficiente para la redirección)
        res.cookie(tipo === 'exito' ? 'mensajeExito' : 'mensajeError', mensaje, { httpOnly: true, maxAge: 5000 });
        res.redirect(url);
    };

    next();
};
