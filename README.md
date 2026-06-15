# 🏥 Sistema de Gestión de Turnos Médicos

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=005C84&height=120&section=header&text=GRUPO%20J&fontSize=30&fontColor=ffffff" width="100%" />

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](#)
[![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](#)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](#)

*API RESTful robusta, modular y segura, diseñada para optimizar los procesos operativos y analíticos de una institución de salud.*

</div>

---

## 🏛️ Información Institucional
* **Universidad:** Universidad Nacional de Entre Ríos (UNER)
* **Facultad:** Facultad de Ciencias de la Administración (FCAD)
* **Carrera:** Tecnicatura Universitaria en Desarrollo Web (TUDW)
* **Cátedra:** Programación III
* **Año:** 2026

---

## 🏗️ Arquitectura de la Aplicación

El backend de este proyecto fue construido bajo un patrón estricto de **Diseño en Capas (Separation of Concerns)**, garantizando que cada componente tenga una única responsabilidad clara:

* **Capa de Rutas (`rutas/`):** Define los endpoints expuestos de la API y mapea los verbos HTTP correspondientes (GET, POST, PUT, DELETE).
* **Capa de Middlewares (`middlewares/`):** Actúa como el escudo del sistema. Maneja la autenticación *stateless* por **JWT** y ejecuta el saneamiento de datos entrantes mediante `express-validator`.
* **Capa de Controladores (`controladores/`):** Orquesta el ciclo de vida de la petición HTTP (`req`, `res`). Administra el asincronismo (`async/await`) y maneja de forma segura las excepciones mediante bloques `try/catch`.
* **Capa de Servicios (`servicios/`):** Aloja las reglas operativas y de negocio puras del sistema, manteniéndose totalmente agnóstica de los protocolos de red.
* **Capa de Persistencia (`db/`):** Gestiona el acceso de bajo nivel a los datos a través de un pool optimizado de conexiones a MySQL.

---

## 📊 Módulo Analítico y Rendimiento (BI)

Para el cálculo de métricas e inteligencia de negocios, el sistema evita sobrecargar el hilo único de Node.js. 

> **Optimización SQL:** Delegamos el cómputo matemático pesado (`COUNT`, `SUM(IF)`) directamente al motor relacional mediante el procedimiento almacenado **`pa_estadisticas.sql`**, reduciendo drásticamente el uso de memoria RAM en el servidor de aplicaciones y garantizando respuestas en milisegundos.

---

## ⚙️ Configuración y Despliegue Local

<details>
<summary><b>Haz clic aquí para ver los pasos de instalación</b></summary>

1. **Clonar el repositorio y acceder a la rama de desarrollo:**
   ```bash
   git clone [https://github.com/arielLevita/prog3-turnos-grupoj.git](https://github.com/arielLevita/prog3-turnos-grupoj.git)
   cd prog3-turnos-grupoj
   git checkout develop
