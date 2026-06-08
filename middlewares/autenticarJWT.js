import passport from 'passport';

export const autenticarJWT = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, usuario, info) => {
        if (err) {
            return res.status(500).json({
                estado: false,
                mensaje: 'Error en la autenticación',
                error: err.message
            });
        }

        if (!usuario) {
            let mensajePersonalizado = 'Token inválido o expirado';

            if (info?.name === 'TokenExpiredError') {
                mensajePersonalizado = 'El token ha expirado. Por favor, utilice su refresh token o inicie sesión nuevamente.';
            } else if (info?.name === 'JsonWebTokenError') {
                mensajePersonalizado = 'Token inválido. Por favor, verifique sus credenciales.';
            } else if (info?.name === 'NotBeforeError') {
                mensajePersonalizado = 'El token aún no es válido.';
            } else if (info?.message === 'No auth token') {
                mensajePersonalizado = 'No se proporcionó un token de autenticación.';
            }

            return res.status(401).json({
                estado: false,
                mensaje: mensajePersonalizado,
                error: info?.message,
                tipo: info?.name
            });
        }

        req.user = usuario;
        next();
    })(req, res, next);
};
