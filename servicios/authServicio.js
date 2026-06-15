import jwt from 'jsonwebtoken';
import UsuariosServicio from './usuariosServicio.js';
import UsuarioResponseDto from '../dtos/usuarioResponseDto.js';

export default class AuthServicio {
    constructor() {
        this.refreshTokens = new Map();
        this.usuariosServicio = new UsuariosServicio();
    }

    generarAccessToken(usuario) {
        return jwt.sign(
            {
                id_usuario: usuario.idUsuario || usuario.id_usuario,
                nombre_usuario: usuario.nombreUsuario || usuario.email
            },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' }
        );
    }

    generarRefreshToken(usuario) {
        return jwt.sign(
            {
                id_usuario: usuario.idUsuario || usuario.id_usuario,
                nombre_usuario: usuario.nombreUsuario || usuario.email
            },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' }
        );
    }

    async refreshAccessToken(refreshToken) {
        if (!this.refreshTokens.has(refreshToken)) {
            throw new Error('Refresh token inválido o no existe en el registro');
        }

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const idUsuario = decoded.id_usuario || decoded.idUsuario;

            if (!idUsuario) {
                throw new Error('El token decodificado no contiene un ID de usuario válido');
            }

            const usuarioDb = await this.usuariosServicio.buscarPorId(idUsuario);

            if (!usuarioDb) {
                throw new Error('Usuario no encontrado');
            }

            // const usuarioMapped = new UsuarioResponseDto(usuarioDb);
            // const newAccessToken = this.generarAccessToken(usuarioMapped);
            const newAccessToken = this.generarAccessToken(usuarioDb);

            return {
                accessToken: newAccessToken
            };
        } catch (error) {
            this.refreshTokens.delete(refreshToken);
            throw new Error('Refresh token expirado o inválido');
        }
    }

    logout(refreshToken) {
        this.refreshTokens.delete(refreshToken);
    }
}
