# Universidad Nacional de Entre Ríos
## Facultad de Ciencias de la Administración

## Tecnicatura Universitaria en Desarrollo Web
### Cátedra: Programación III
### Grupo J

---

## Integrantes del Equipo

- Ariel Levita (@arielLevita)
- Elisa Beltramone (@Elisa-Beltramone)
- Gabriel Osvaldo Roman (@GabrielORoman)
- María Olivares (@MaryOlivares)
- Nerina Bonnin (@NerinaBonnin)
- Walter Cuesta (@wox9000)

---

## Resumen de Cambios: Rama `entrega2-continuacion`

Aquí les detallo todas las mejoras, refactorizaciones y nuevas lógicas que se implementaron para dejar el proyecto alineado con las exigencias del profe y las buenas prácticas de arquitectura:

**1. Correcciones en Especialidades (Pedido del profe)**
*   **Validaciones en la capa correcta:** El profe nos había observado que el control de existencia (`buscarPorId`) antes de modificar o borrar tenía que hacerse en la capa de Servicios y no en el Controlador. Ya moví esa lógica a `especialidadesServicio.js`.
*   **Respuestas más completas:** Ahora, cuando hacemos un `PUT` (modificar) o `POST` (crear), el Controlador devuelve el objeto entero actualizado en lugar de solo devolver un ID o un "true", lo cual es una mejor práctica para el Frontend.

**2. Estrategia de Médicos y Obras Sociales (El gran desafío de la clase)**
*   **Inteligencia Anti-Duplicados:** Como el profe mostró que un simple `INSERT` en la tabla intermedia daba error si la relación ya existía, armé un algoritmo en `medicosServicio.js`. Este primero consulta qué obras sociales ya tiene el médico, las compara con las que llegan, y **solamente inserta las nuevas**. Esto evita errores de MySQL y no sobrecarga la base de datos.
*   **Transacciones seguras en la BD:** En `medicosDb.js` blindé la conexión a la base de datos agregando dos cosas clave:
    *   `throw error`: Si la DB falla, el error "viaja" hasta el Controlador para devolver un código 500 real.
    *   `finally { conexion.release() }`: Garantiza que la conexión se devuelva al "pool" siempre, haya fallado o no la consulta. Sin esto, el servidor se nos iba a colgar con el tiempo.
*   **Nuevos Endpoints:** Agregué las dos rutas manuales para manejar la tabla intermedia:
    *   `POST /medicos/:id/obras-sociales` (Para asociar)
    *   `DELETE /medicos/:id/obras-sociales/:id_os` (Para desasociar)

**3. Lógica de Turnos y Orquestación (Actualizado con el repo del Profe)**
*   **Orquestación de Servicios (Arquitectura Avanzada):** Implementamos el patrón de "Comunicación entre Servicios". Ahora, nuestro `turnosServicio.js` actúa como un verdadero director de orquesta: en lugar de llamar directamente a las bases de datos de otras entidades, consume a `MedicosServicio`, `PacientesServicio` y `ObrasSocialesServicio`. Así, los datos nos llegan limpios y seguros a través de nuestros DTOs (ej: `medico.valorConsulta` parseado).
*   **Deducción Automática de Obra Social:** Ya no esperamos que el Frontend nos mande el ID de la obra social al crear un turno. El sistema toma el ID del Paciente, busca su obra social real y la inyecta automáticamente. Esto evita inconsistencias de datos por errores humanos.
*   **Cálculo Matemático Seguro (PARA REVISAR):** Implementamos la fórmula de descuento correcta `ValorConsulta - ((Descuento * ValorConsulta) / 100)`. *(Nota de revisión: El profe mencionó en clase que cambió el tipo de dato en la base de datos, guardando el descuento como `0.10` en lugar de `10.0` para ahorrarse la división por 100 y hacer solo multiplicación. Esto queda pendiente de revisión grupal para decidir si nosotros también modificamos nuestra base de datos y borramos la división de nuestro código).*

**4. Estandarización y Configuraciones (Limpieza general)**
*   **Limpieza de Nombres:** Eliminamos el uso ambiguo de la palabra "reservas" que había quedado en el código base. Ahora todas las rutas (`/api/v2/turnos`) y los parámetros (`/:id_turno`) usan la entidad **Turnos** de forma consistente de punta a punta.
*   **Arreglo de Swagger Docs:** Se corrigió la ruta de lectura de los comentarios JSDoc, por lo que la documentación interactiva de Swagger ya vuelve a funcionar perfectamente.
*   **Protección de Logs (Morgan):** Configuramos Morgan para escribir los registros en `accesos.log`, pero lo agregamos al archivo `.gitignore`. De esta forma tenemos logs locales, pero evitamos que Git genere conflictos cada vez que alguien prueba el servidor.

**5. Estrategia de Caché**
La configuración de rendimiento quedó establecida así:
*   **Rutas GET de Especialidades y Obras Sociales:** Llevan el middleware de caché (ej: `cache("5 minutes")`) para consultas rapidísimas.
*   **Servicios de Especialidades y Obras Sociales (POST, PUT, DELETE):** Llevan `apicache.clear()` tras guardar en la base de datos para obligar al sistema a renovar la memoria.
*   **Médicos, Turnos y Pacientes:** Quedan sin caché para mantener su disponibilidad y agendamiento 100% en tiempo real.