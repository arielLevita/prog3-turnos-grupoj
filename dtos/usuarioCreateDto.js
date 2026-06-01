import crypto from 'crypto';

export default class UsuarioCreateDto {
    constructor(object) {
        this.documento = object.documento ? object.documento.trim() : null;
        this.apellido = object.apellido ? object.apellido.trim().toUpperCase() : null;
        this.nombres = object.nombres ? object.nombres.trim().toUpperCase() : null;
        this.email = object.email ? object.email.trim().toLowerCase() : null;
        if (object.contrasenia) {
            this.contrasenia = crypto.createHash('sha256').update(object.contrasenia).digest('hex');
        } else {
            this.contrasenia = null;
        }
        this.fotoPath = object.fotoPath ? object.fotoPath.trim() : '';
        this.rol = object.rol ? parseInt(object.rol) : 2;
    }
}