<div align="center">

# 🏥 Sistema de Gestión de Turnos Médicos

<img src="https://capsule-render.vercel.app/api?type=waving&color=005C84&height=120&section=header&text=GRUPO%20J&fontSize=30&fontColor=ffffff" width="100%" />

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](#)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](#)
[![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)](#)
[![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)](#)

*Una API RESTful robusta, modular y segura, diseñada para optimizar los procesos operativos y el análisis de datos de instituciones de salud.*

</div>

---

## 🏛️ Información TFI PROGIII 
* **Universidad:** Universidad Nacional de Entre Ríos (UNER)
* **Facultad:** Facultad de Ciencias de la Administración (FCAD)
* **Carrera:** Tecnicatura Universitaria en Desarrollo Web (TUDW)
* **Cátedra:** Programación III

---

## 🏗️ Arquitectura del Sistema

Implementamos una arquitectura estricta basada en el patrón de **Separation of Concerns (Capas)** para garantizar escalabilidad y un código limpio.

```mermaid
graph TD
    Cliente([📱 Cliente / Postman]) --> Rutas
    
    subgraph CapaRed [🛡️ Capa de Red y Seguridad]
        Rutas[Rutas de Express] --> Middlewares[Middlewares JWT]
        Middlewares --> Controladores[Controladores]
    end
    
    subgraph CapaNegocio [🧠 Capa de Negocio]
        Controladores --> Servicios[Servicios de Negocio]
    end
    
    subgraph CapaPersistencia [💾 Capa de Persistencia]
        Servicios --> DAOs[Acceso a Datos]
        DAOs --> MySQL[(MySQL DB)]
    end
```

---

## 📊 Modulo estadísticas

Se delega el cómputo matemático intensivo directamente al motor de BD:

> **Procedimiento Almacenado `pa_estadisticas`:** Libera el *Event Loop* de Node.js al ejecutar funciones de agregación (`SUM`, `COUNT`, `GROUP BY`) directamente en MySQL, optimizando el ancho de banda y garantizando reportes de métricas en milisegundos sin afectar la atención de pacientes.

---

## ⚡ Guía Rápida de Instalación

<details>
<summary><b>Haz clic para expandir las instrucciones de despliegue local</b></summary>

1. **Clona el repositorio:**
   ```bash
   git clone [https://github.com/arielLevita/prog3-turnos-grupoj.git](https://github.com/arielLevita/prog3-turnos-grupoj.git)
   cd prog3-turnos-grupoj
   git checkout develop
   ```
2. **Instala las dependencias:**
   ```bash
   npm install
   ```
3. **Variables de Entorno:**
   Copia el archivo `.env.ejemplo`, renómbralo a `.env` y ajusta tus credenciales. *(Recomendación de seguridad: No uses el usuario root)*.
4. **Base de Datos:**
   Importa los scripts de la carpeta `db/procedimientos` en tu servidor MySQL.
5. **Ejecuta la API:**
   ```bash
   npm run dev
   ```

</details>

---

## 👨‍💻 Equipo de Desarrollo (Grupo J)

<div align="center">

| <a href="https://github.com/wox9000"><img src="https://github.com/wox9000.png" width="80px;" alt=""/><br /><sub><b>Walter Cuesta</b></sub></a> | <a href="https://github.com/arielLevita"><img src="https://github.com/arielLevita.png" width="80px;" alt=""/><br /><sub><b>Ariel Levita</b></sub></a> | <a href="https://github.com/Elisa-Beltramone"><img src="https://github.com/Elisa-Beltramone.png" width="80px;" alt=""/><br /><sub><b>Elisa Beltramone</b></sub></a> |
| :---: | :---: | :---: |
| <a href="https://github.com/GabrielORoman"><img src="https://github.com/GabrielORoman.png" width="80px;" alt=""/><br /><sub><b>Gabriel Roman</b></sub></a> | <a href="https://github.com/MaryOlivares"><img src="https://github.com/MaryOlivares.png" width="80px;" alt=""/><br /><sub><b>María Olivares</b></sub></a> | <a href="https://github.com/NerinaBonnin"><img src="https://github.com/NerinaBonnin.png" width="80px;" alt=""/><br /><sub><b>Nerina Bonnin</b></sub></a> |

</div>
