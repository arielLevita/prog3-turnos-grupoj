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
```markdown
<div align="center">

# 🏥 Medical API - Gestión de Turnos

<img src="https://capsule-render.vercel.app/api?type=waving&color=005C84&height=120&section=header&text=GRUPO%20J&fontSize=30&fontColor=ffffff" width="100%" />

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](#)
[![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](#)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](#)

*Una API RESTful robusta, modular y segura, diseñada para optimizar los procesos operativos y el análisis de datos de instituciones de salud.*

[Explorar Documentación](#-endpoints-principales) · [Reportar un Bug](https://github.com/arielLevita/prog3-turnos-grupoj/issues)

</div>

---

## 🏗️ Arquitectura del Sistema

Implementamos una arquitectura estricta basada en el patrón de **Separation of Concerns (Capas)** para garantizar escalabilidad y un código limpio.

```mermaid
graph TD
    Client([📱 Cliente / Postman]) -.->|HTTP Request| Rutas
    
    subgraph 🛡️ Capa de Red y Seguridad
        Rutas[Rutas de Express] --> Middlewares
        Middlewares[Passport JWT & Express-Validator] --> Controladores
    end
    
    subgraph 🧠 Capa de Negocio
        Controladores[Controladores] --> Servicios
        Servicios[Servicios de Negocio]
    end
    
    subgraph 💾 Capa de Persistencia
        Servicios --> DAOs[Data Access / BD]
        DAOs -.->|Pool de Conexiones| MySQL[(MySQL DB)]
    end

    classDef blue fill:#005C84,stroke:#fff,stroke-width:2px,color:#fff;
    class MySQL blue;

```
## 📊 Inteligencia de Negocios (El Diferencial)
No solo transaccionamos datos, **creamos valor**. Nuestro módulo de estadísticas delega el cómputo matemático intensivo directamente al motor relacional:
> **Procedimiento Almacenado pa_estadisticas:** > Libera el *Event Loop* de Node.js al ejecutar funciones de agregación (SUM, COUNT, GROUP BY) directamente en MySQL, optimizando el ancho de banda y garantizando reportes de métricas en milisegundos.
> 
## ⚡ Guía Rápida de Instalación
<details>
<summary><b>Haz clic para expandir las instrucciones de despliegue local</b></summary>
 1. **Clona el repositorio:**
   ```bash
   git clone [https://github.com/arielLevita/prog3-turnos-grupoj.git](https://github.com/arielLevita/prog3-turnos-grupoj.git)
   cd prog3-turnos-grupoj
   
   ```
 2. **Instala las dependencias:**
   ```bash
   npm install
   
   ```
 3. **Variables de Entorno:**
   Copia el archivo .env.ejemplo, renómbralo a .env y ajusta tus credenciales. *(Recomendación: No uses el usuario root)*.
 4. **Base de Datos:**
   Importa los scripts de la carpeta db/procedimientos en tu servidor MySQL.
 5. **Ejecuta la API:**
   ```bash
   npm run dev
   
   ```
</details>
## 🧭 Endpoints Principales
<details>
<summary>🔐 <b>Autenticación & Seguridad</b></summary>
 * POST /api/v2/auth/login - Genera el JWT.
 * POST /api/v2/auth/register - Registro de nuevos usuarios con encriptación.
   </details>
<details>
<summary>🏥 <b>Gestión Operativa (Turnos y Médicos)</b></summary>
 * GET /api/v2/turnos - Lista turnos (Requiere Auth).
 * POST /api/v2/turnos - Asigna un nuevo turno validando superposiciones.
 * GET /api/v2/medicos - Directorio de profesionales.
   </details>
<details>
<summary>📈 <b>Reportes BI</b></summary>
 * GET /api/v2/estadisticas - Retorna el resumen analítico generado por el Procedimiento Almacenado.
   </details>
## 👨‍💻 Equipo de Ingeniería (Grupo J)
<div align="center">
| <a href="https://github.com/wox9000"><img src="https://github.com/wox9000.png" width="80px;" alt=""/><br /><sub><b>Walter Cuesta</b></sub></a> | <a href="https://github.com/arielLevita"><img src="https://github.com/arielLevita.png" width="80px;" alt=""/><br /><sub><b>Ariel Levita</b></sub></a> | <a href="https://github.com/Elisa-Beltramone"><img src="https://github.com/Elisa-Beltramone.png" width="80px;" alt=""/><br /><sub><b>Elisa Beltramone</b></sub></a> |
|---|---|---|
| <a href="https://github.com/GabrielORoman"><img src="https://github.com/GabrielORoman.png" width="80px;" alt=""/><br /><sub><b>Gabriel Roman</b></sub></a> | <a href="https://github.com/MaryOlivares"><img src="https://github.com/MaryOlivares.png" width="80px;" alt=""/><br /><sub><b>María Olivares</b></sub></a> | <a href="https://github.com/NerinaBonnin"><img src="https://github.com/NerinaBonnin.png" width="80px;" alt=""/><br /><sub><b>Nerina Bonnin</b></sub></a> |
</div>


<div align="center">
<i>Desarrollado para Programación III (TUDW - UNER FCAD)</i>
</div>
```
