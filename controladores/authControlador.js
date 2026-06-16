import passport from 'passport';
import AuthServicio from '../servicios/authServicio.js';
import UsuarioResponseDto from '../dtos/usuarioResponseDto.js';

export default class AuthController {
    constructor() {
        this.authServicio = new AuthServicio();
    }

    login = async (req, res) => {        
        passport.authenticate('local', {session: false}, (err, usuarioDb, info) => {
            if (err || !usuarioDb) {
                return res.status(400).json({
                    estado: false,
                    mensaje: "Solicitud incorrecta o credenciales inválidas." 
                });
            }
        
            req.login(usuarioDb, { session: false }, (err) => {
                if(err){
                    res.send(err);
                }
            
                const usuarioMapped = new UsuarioResponseDto(usuarioDb);

                const accessToken = this.authServicio.generarAccessToken(usuarioMapped);
                const refreshToken = this.authServicio.generarRefreshToken(usuarioMapped);

                this.authServicio.refreshTokens.set(refreshToken, usuarioMapped.idUsuario);

                return res.json({
                    estado: true, 
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    usuario: usuarioMapped
                });
            });
        })(req, res);
    }

    refresh = async (req, res) => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({ estado: false, mensaje: 'Refresh token es requerido' });
            }

            const result = await this.authServicio.refreshAccessToken(refreshToken);
            res.json({ estado: true, ...result });
        } catch (error) {
            console.error(error);
            res.status(401).json({ estado: false, mensaje: error.message });
        }
    }

    logout = async (req, res) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ estado: false, mensaje: 'Refresh token es requerido' });
            }

            this.authServicio.logout(refreshToken);
            res.status(204).send();
        } catch (error) {
            console.error(error);
            res.status(500).json({ estado: false, mensaje: 'Error al cerrar sesión' });
        }
    }
}