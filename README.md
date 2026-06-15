<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,3,12&height=160&section=header&text=Sistema%20de%20Turnos%20Médicos&fontSize=32&fontColor=ffffff&desc=API%20RESTful%20%E2%80%94%20Grupo%20J%20%E2%80%94%20Programación%203%20%E2%80%94%20UNER%20Concordia&descSize=14&descAlignY=78" width="100%" />

[![Node.js](https://img.shields.io/badge/Node.js_v24-43853D?style=flat-square&logo=node.js&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=flat-square&logo=express&logoColor=white)](#)
[![MySQL](https://img.shields.io/badge/MySQL_8-005C84?style=flat-square&logo=mysql&logoColor=white)](#)
[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](#)
[![JWT](https://img.shields.io/badge/JWT-black?style=flat-square&logo=JSON%20web%20tokens)](#)
[![Passport.js](https://img.shields.io/badge/Passport.js-34E27A?style=flat-square&logo=passport&logoColor=black)](#)
[![Swagger](https://img.shields.io/badge/Swagger_UI-85EA2D?style=flat-square&logo=swagger&logoColor=black)](#)

**API REST para la gestión integral de turnos en instituciones de salud.**  
Diseñada con separación estricta de responsabilidades, seguridad por capas y un módulo de analítica orientado a la toma de decisiones clínicas.

</div>

---

## Índice

- [Diseño](#️-diseño-del-sistema)
- [Seguridad](#-seguridad-autenticación--autorización)
- [Módulos principales](#-módulos-del-sistema)
- [Requerimientos](#-requerimientos-de-arquitectura)
- [Instalación](#-instalación-local)
- [Documentación](#-documentación-interactiva)
- [Equipo](#-equipo-de-desarrollo)

---

##  Diseño del Sistema

El sistema implementa una **arquitectura de cuatro capas**. Cada capa tiene una responsabilidad única y no puede saltear a otra.

```
┌─────────────────────────────────────────────────────┐
│                  CLIENTE / SWAGGER UI               │
│              HTTP Request con Bearer Token          │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│            CAPA DE RED Y SEGURIDAD                  │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │
│  │   Rutas     │→ │  Middleware  │→ │Controlador │ │
│  │  Express    │  │ JWT / RBAC   │  │            │ │
│  └─────────────┘  └──────────────┘  └─────┬──────┘ │
└────────────────────────────────────────────│────────┘
                                             │
┌────────────────────────────────────────────▼────────┐
│              CAPA DE LÓGICA DE NEGOCIO              │
│                    Servicios                        │
│         (orquestación, validación, switch)          │
└────────────────────────────────────────────┬────────┘
                                             │
┌────────────────────────────────────────────▼────────┐
│               CAPA DE PERSISTENCIA                  │
│  ┌──────────────────────┐   ┌──────────────────┐   │
│  │    DAOs / Clases DB  │   │ Stored Procedures│   │
│  └──────────────────────┘   └──────────────────┘   │
│                    MySQL 8                          │
└─────────────────────────────────────────────────────┘
```

> El controlador nunca accede a la base de datos directamente. El DAO nunca aplica lógica de negocio. Esta separación permite testear, reemplazar o escalar cada capa de forma independiente.

---

##  Seguridad: Autenticación + Autorización

El sistema implementa una **estrategia de seguridad en dos fases** usando Passport.js:

```
POST /auth/login
       │
       ▼
┌─────────────────┐     credenciales     ┌──────────────────┐
│  LocalStrategy  │ ──────────────────→  │      Base        │
│  (Passport.js)  │ ←──────────────────  │    de datos      |
└────────┬────────┘      ✓ / ✗          └──────────────────┘
         │ ✓ usuario válido
         ▼
┌─────────────────┐
│   JWT firmado   │  { id_usuario, rol, email }
│   (Access +     │  ──────────────────────────→  Cliente
│   Refresh)      │
└─────────────────┘
         │
         │  En cada request protegido:
         ▼
┌─────────────────┐     ┌──────────────────────────┐
│  JwtStrategy    │ ──→ │  autorizarUsuarios([rol])│
│  verifica token │     │                          │
└─────────────────┘     └──────────────────────────┘
```

| Tipo de ruta | Protección aplicada |
|---|---|
| `POST /auth/login` | Pública |
| Rutas operativas (turnos, médicos, pacientes) | `verificarToken` — autenticación |
| `GET /api/v2/estadisticas/:tipo` | `verificarToken` + `autorizarUsuarios([3])` — autenticación **y** autorización por rol |

---

## Módulos del Sistema

### Módulo de Turnos
CRUD completo para la gestión de reservas. Incluye filtros por médico, especialidad, fecha y estado. Validación de solapamiento horario en capa de servicio.

### Módulo Frontend (React)
El backend cuenta con soporte CORS habilitado, lo que permitió su integración exitosa con una aplicación desarrollada en React.

### Módulo de Usuarios, Médicos y Pacientes
Gestión de entidades con sus relaciones. Los médicos tienen especialidades asociadas; los pacientes tienen obra social vinculada. El usuario tiene rol asignado que determina sus permisos en todo el sistema.

### Módulo de Obras Sociales y Especialidades
Catálogos con alta, baja y modificación. Sirven como tablas de referencia para turnos y pacientes.

### Módulo de Estadísticas
Se crea el Procedimiento Almacenado (Stored Procedure) en MySQL, se añade un `case` en `EstadisticasServicio`. Reportes disponibles: Especialidades, Obras Sociales, Medicos. Trae qué entidad fue usada más.
Los tres reportes comparten la misma lógica de filtrado: `activo = 1` y `fecha_hora` dentro del rango indicado. La diferencia está en la dimensión de agrupación (`GROUP BY obra_social / médico / especialidad`) y en los JOINs necesarios para obtener el nombre de cada entidad.

### Módulo de Vistas (Handlebars)
Renderizado server-side para visualización web de turnos. Complementa la API REST con una interfaz navegable en `/web/turnos`.

---

##  Requerimientos de Arquitectura

| Decisión | Alternativa descartada | Por qué esta opción |
|---|---|---|
| **Stored Procedures** para estadísticas | Queries en capa de servicio | Agrupaciones y joins pesados son más eficientes en el motor de BD; desacopla la lógica de cálculo del código JS |
| **Passport.js** para autenticación | Middleware manual con JWT | Abstrae las estrategias (local + JWT) con una interfaz unificada; facilita agregar OAuth en el futuro |
| **Control de Acceso Basado en Roles con roles numéricos** | Flags booleanos por permiso | Escala sin modificar el esquema; agregar un rol nuevo no requiere columnas nuevas |
| **express-validator** antes de llegar al Data Access Object | Validar en el controlador | Corta el flujo antes de tocar la base de datos; previene inyecciones y reduce carga innecesaria |
| **Swagger generado desde JSON** | JSDoc en línea en las rutas | Separa la documentación del código de negocio; permite mantener y versionar los docs de forma independiente |

---

## ⚡ Instalación Local

```bash
# 1. Clonar el repositorio y pararse en la rama de desarrollo
git clone https://github.com/arielLevita/prog3-turnos-grupoj.git
cd prog3-turnos-grupoj
git checkout develop

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Editar .env con las credenciales de tu MySQL local

# 4. Importar base de datos
# Ejecutar los scripts en /db/procedimientos en tu servidor MySQL

# 5. Levantar el servidor
npm run dev
```

**Variables de entorno requeridas:**

```env
PUERTO=
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=tu_base
JWT_ACCESS_SECRET=tu_secreto_acceso
JWT_REFRESH_SECRET=tu_secreto_refresh
```

---

## 📖 Documentación

Con el servidor corriendo, la documentación completa está disponible en:

```
http://localhost:3007/api-docs
```

Incluye todos los endpoints documentados con esquemas de request/response, autenticación Bearer integrada y ejemplos de uso. Para probar endpoints protegidos:

1. `POST /auth/login` con las credenciales del usuario
2. Copiar el `token` de la respuesta
3. Usar el botón **Authorize** en Swagger UI y pegar el token

**Usuario de prueba (administrador):**
```
email:      admin@clinica.com
contraseña: admin123
rol:        3 (acceso a estadísticas)
```

---

## 👥 Equipo de Desarrollo

<div align="center">

| <a href="https://github.com/arielLevita"><img src="https://github.com/arielLevita.png" width="72px" style="border-radius:50%"/><br/><b>Ariel Levita</b></a> | <a href="https://github.com/Elisa-Beltramone"><img src="https://github.com/Elisa-Beltramone.png" width="72px" style="border-radius:50%"/><br/><b>Elisa Beltramone</b></a> | <a href="https://github.com/wox9000"><img src="https://github.com/wox9000.png" width="72px" style="border-radius:50%"/><br/><b>Walter Cuesta</b></a> |
|:---:|:---:|:---:|
|  |  |  |

| <a href="https://github.com/GabrielORoman"><img src="https://github.com/GabrielORoman.png" width="72px" style="border-radius:50%"/><br/><b>Gabriel Roman</b></a> | <a href="https://github.com/MaryOlivares"><img src="https://github.com/MaryOlivares.png" width="72px" style="border-radius:50%"/><br/><b>María Olivares</b></a> | <a href="https://github.com/NerinaBonnin"><img src="https://github.com/NerinaBonnin.png" width="72px" style="border-radius:50%"/><br/><b>Nerina Bonnin</b></a> |
|:---:|:---:|:---:|
|  |  |  |

</div>

---

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=2,3,12&height=80&section=footer" width="100%" />

*Facultad de Ciencias de la Administración · UNER | FCAD | Sede Concordia  · Programación 3 · 2026*
</div>