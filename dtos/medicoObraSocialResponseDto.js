export default class MedicoObraSocialResponseDto {
    constructor(dbRow) {
        this.idMedicoObraSocial = dbRow.id_medico_obra_social;
        this.idMedico = dbRow.id_medico;
        this.idObraSocial = dbRow.id_obra_social;
        this.medicoNombre = dbRow.medico_nombre; 
        this.obraSocialNombre = dbRow.obra_social_nombre;
    }
}