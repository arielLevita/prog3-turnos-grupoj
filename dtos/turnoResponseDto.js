export default class TurnoResponseDto {
    constructor(dbRow) {
        this.idTurnoReserva = dbRow.id_turno_reserva;
        this.idMedico = dbRow.id_medico;
        this.idPaciente = dbRow.id_paciente;
        this.idObraSocial = dbRow.id_obra_social;
        this.fechaHora = dbRow.fecha_hora;
        this.valorTotal = parseFloat(dbRow.valor_total);
        this.atendido = dbRow.atentido === 1; 
        this.medicoNombre = dbRow.medico_nombre;
        this.especialidadNombre = dbRow.especialidad_nombre;
        this.pacienteNombre = dbRow.paciente_nombre;
        this.obraSocialNombre = dbRow.obra_social_nombre;
    }
}