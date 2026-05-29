export default class TurnoResponseDto {
    constructor(dbRow) {
        this.idTurnoTurno = dbRow.id_turno_reserva;
        this.idMedico = dbRow.id_medico;
        this.idPaciente = dbRow.id_paciente;
        this.idObraSocial = dbRow.id_obra_social;
        this.fechaHora = dbRow.fecha_hora;
        this.valorTotal = parseFloat(dbRow.valor_total);
        // Transformamos el TINYINT a Booleano para el Frontend
        this.atendido = dbRow.atendido === 1; 

        // --- CAMPOS ENRIQUECIDOS CON JOINs ---
        this.medicoNombre = dbRow.medico_nombre;
        this.pacienteNombre = dbRow.paciente_nombre;
        this.obraSocialNombre = dbRow.obra_social_nombre;
    }
}