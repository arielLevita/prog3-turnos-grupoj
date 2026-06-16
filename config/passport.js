import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalSrategy } from "passport-local";
import UsuariosServicio from "../servicios/usuariosServicio.js"

const usuariosServicio = new UsuariosServicio();

const estrategia = new LocalSrategy({
    usernameField: 'email', 
    passwordField: 'contrasenia'
}, 
    async (email, contrasenia, done) => {
        try{
            const usuario = await usuariosServicio.buscar(email, contrasenia);
            if(!usuario){
                return done(null, false, { estado: false, mensaje: 'Login incorrecto!'})
            }
            return done(null, usuario, {estado: true, mensaje: 'Login correcto!'})
        }
        catch(exc){
            done(exc);
        }
    }
)

const validacion = new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_ACCESS_SECRET
},
    async (jwtPayload, done) => {
        try {
            const idSeguro = jwtPayload.id_usuario || jwtPayload.idUsuario;

            if (!idSeguro) {
                console.error("Alerta de seguridad: Token recibido sin ID de usuario");
                return done(null, false, { mensaje: 'Token corrupto o inválido!' });
            }

            const usuario = await usuariosServicio.buscarPorId(idSeguro);
            
            if (!usuario) {
                return done(null, false, { mensaje: 'Usuario no encontrado!' });
            }

            return done(null, usuario);
        } catch (error) {
            console.error("Error en validación JWT:", error);
            return done(error, false);
        }
    }
)

export { estrategia, validacion };