# Gestión de Peritos Informáticos — API REST

Trabajo práctico de Backend: API para administrar usuarios/peritos informáticos, consultar sus roles y realizar bajas lógicas sin eliminar los registros de la base de datos.

## Tecnologías utilizadas

- **Node.js** y **Express 5:** servidor HTTP y rutas REST.
- **Sequelize 6:** ORM para acceder a bases de datos relacionales.
- **SQLite:** motor utilizado para desarrollo local; se incluye `forensics.db`.
- **PostgreSQL:** alternativa de conexión configurable por variables de entorno.
- **http-errors:** generación de errores HTTP.
- **Morgan:** registro de peticiones en la consola.
- **Chalk:** mensajes destacados en consola.
- **dotenv:** lectura opcional del archivo `.env`.

## Requisitos

- Node.js y npm instalados.
- Postman o cualquier cliente HTTP para probar los endpoints.
- Para usar PostgreSQL: una instancia PostgreSQL accesible y una base creada con las credenciales correspondientes.

## Instalación y ejecución con SQLite

1. Clonar el repositorio y entrar en la carpeta del proyecto:

   ```bash
   git clone https://github.com/adandemarco/Tp-BackEnd.git
   cd Tp-BackEnd
   ```

   Si se descarga un ZIP, descomprimirlo y abrir una terminal en la carpeta que contiene `package.json`.

2. Instalar las dependencias:

   ```bash
   npm ci
   ```

   Alternativamente, usar `npm install`.

3. Iniciar la API desde la raíz del proyecto:

   ```bash
   npm start
   ```

4. La API quedará disponible en:

   ```text
   http://localhost:3001/api/v1/peritos
   ```

**SQLite es la opción predeterminada:** si no se define `DB_DIALECT=postgres`, la aplicación usa el archivo `./forensics.db` desde el directorio de trabajo. El repositorio incluye una base SQLite para facilitar las pruebas locales.

> Para evitar alterar los datos iniciales de la entrega, se recomienda hacer una copia de `forensics.db` antes de ejecutar pruebas de altas y bajas.

## Configuración de la base de datos

La conexión se define en `src/config/database.js` mediante Sequelize.

### SQLite (predeterminado)

Opcionalmente, crear un archivo `.env` en la raíz:

```dotenv
DB_DIALECT=sqlite
DB_STORAGE=./forensics.db
```

### PostgreSQL (alternativa)

Para utilizar PostgreSQL, crear una base de datos y configurar un archivo `.env` en la raíz del proyecto:

```dotenv
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=forensics
DB_USER=postgres
DB_PASSWORD=cambiar_por_una_contrasena_local
```

Después, inicializar las tablas y cargar los roles:

```bash
node src/sync-db.js
node src/seed-roles.js
npm start
```

**Importante:** el proyecto implementa la configuración para PostgreSQL, pero **no incluye un servidor PostgreSQL ni un contenedor Docker preconfigurado**. Se debe disponer de una instancia propia para utilizar y verificar este motor. No se necesita PostgreSQL para ejecutar la versión local con SQLite.

El archivo `.env` está excluido de Git mediante `.gitignore` para evitar subir credenciales.

## Modelo de datos

### Tabla `roles`

| Campo | Descripción |
|---|---|
| `id` | Clave primaria autoincremental. |
| `nombre_rol` | Nombre obligatorio y único. |

Roles utilizados:

- `ADMIN`
- `FORENSIC_INSPECTOR`
- `AUDITOR`

### Tabla `users`

| Campo | Descripción |
|---|---|
| `id` | Clave primaria autoincremental. |
| `username` | Nombre de usuario obligatorio y único. |
| `role_id` | Clave foránea obligatoria a `roles.id`. |
| `active` | Estado del usuario; por defecto `true`. |
| `created_at` | Fecha de creación; se asigna automáticamente. |

Las asociaciones Sequelize son `User.belongsTo(Role)` y `Role.hasMany(User)`. La clave foránea utiliza `ON UPDATE CASCADE` y `ON DELETE RESTRICT`. En la conexión SQLite se habilita `PRAGMA foreign_keys = ON`.

## Endpoints

URL base: `http://localhost:3001/api/v1/peritos`

| Método | Ruta | Descripción | Éxito |
|---|---|---|---|
| `POST` | `/api/v1/peritos` | Registrar un perito. | `201 Created` |
| `GET` | `/api/v1/peritos` | Listar únicamente peritos activos, incluyendo su rol. | `200 OK` |
| `GET` | `/api/v1/peritos?role=ADMIN` | Filtrar peritos activos por nombre de rol. | `200 OK` |
| `GET` | `/api/v1/peritos/:id` | Consultar un perito activo por ID. | `200 OK` |
| `DELETE` | `/api/v1/peritos/:id` | Dar de baja lógicamente un perito. | `200 OK` |

### 1. Crear un perito — POST

**Petición**

```http
POST /api/v1/peritos
Content-Type: application/json
```

```json
{
  "username": "perito_demo",
  "role_id": 2
}
```

**Respuesta de ejemplo (`201 Created`)**

```json
{
  "mensaje": "Perito creado correctamente",
  "perito": {
    "id": 4,
    "username": "perito_demo",
    "role_id": 2,
    "active": true,
    "created_at": "2026-11-25T12:00:00.000Z"
  }
}
```

*El ID y la fecha son ilustrativos; dependen de los registros y del momento del alta.*

Validaciones principales:

- `400`: `username` faltante, vacío o con un tipo de dato inválido; `role_id` inválido o inexistente.
- `409`: `username` ya registrado, incluso si el usuario existente está inactivo.

### 2. Listar peritos activos — GET

```http
GET /api/v1/peritos
```

Devuelve un arreglo JSON de usuarios activos e incluye la asociación `role` con `nombre_rol`. La consulta utiliza `User.findAll()`, filtro `active: true` e `include` con `required: false` (LEFT OUTER JOIN).

### 3. Filtrar por rol — GET

```http
GET /api/v1/peritos?role=FORENSIC_INSPECTOR
```

El parámetro `role` es opcional. Se compara con el campo `nombre_rol` de la tabla relacionada. Cuando no hay coincidencias se devuelve `200 OK` con `[]`.

### 4. Consultar por ID — GET

```http
GET /api/v1/peritos/2
```

Devuelve el usuario únicamente si existe y está activo; incluye el nombre del rol. Si el ID no corresponde a un usuario activo, responde `404`. Si el ID no es un entero positivo, responde `400`.

### 5. Baja lógica — DELETE

```http
DELETE /api/v1/peritos/2
```

Se busca al usuario por su clave primaria y, si está activo, se ejecuta:

```javascript
await perito.update({ active: false });
```

El registro **no se elimina físicamente**: deja de aparecer en los GET, pero permanece almacenado. Si el usuario no existe o ya está inactivo, la API devuelve `404`. Un ID no válido devuelve `400`.

> Para una demostración en Postman, utilizá el ID de un usuario creado especialmente para pruebas; no des de baja uno de los registros iniciales que quieras conservar.

## Manejo de errores y registros de consola

Todos los controladores utilizan `try/catch` y derivan las excepciones a `src/middlewares/errorHandler.js` mediante `next(error)`.

| Código | Situación |
|---|---|
| `200` | Consulta o baja lógica exitosa. |
| `201` | Usuario creado. |
| `400` | Datos inválidos. |
| `404` | Usuario inexistente o no disponible. |
| `409` | Username duplicado. |
| `500` | Error inesperado del servidor. |

El middleware devuelve respuestas JSON con la propiedad `mensaje`. Para errores internos (`500`), devuelve un mensaje genérico y registra el detalle en consola.

- **Morgan (`dev`)** registra solicitudes, códigos HTTP y tiempos.
- **Chalk cyan** indica un alta exitosa con los datos del usuario.
- **Chalk amarillo** registra los errores `400` y `404`.
- **Chalk rojo** registra los errores `500` y su stack cuando está disponible.

En la implementación actual, el error `409` se devuelve correctamente, pero no tiene un mensaje de color personalizado en el middleware.

## Scripts disponibles

Ejecutar desde la raíz del proyecto:

| Comando | Función |
|---|---|
| `npm start` | Inicia Express en el puerto `3001`. |
| `node src/sync-db.js` | Comprueba conexión y sincroniza tablas Sequelize. |
| `node src/seed-roles.js` | Busca o crea los tres roles del sistema. |
| `node src/test-db.js` | Prueba la conexión a la base configurada. |
| `node src/test-users.js` | Lista usuarios en consola. |
| `node src/test-fk.js` | Consulta claves foráneas de `users` en SQLite. |
| `node src/test-invalid-role.js` | Intenta insertar un usuario con rol inexistente para comprobar la restricción FK. |

**Nota:** el comando `npm test` todavía es el script predeterminado de `package.json`; no ejecuta una batería automatizada. Las pruebas HTTP se realizan con Postman. Los scripts con instrucciones `PRAGMA` están orientados específicamente a SQLite.

## Pruebas sugeridas en Postman

1. `POST /api/v1/peritos` con username nuevo y rol existente → `201`.
2. Repetir el POST con el mismo username → `409`.
3. Enviar un username vacío → `400`.
4. Enviar un `role_id` inexistente → `400`.
5. `GET /api/v1/peritos` → `200`, solo usuarios activos.
6. `GET /api/v1/peritos?role=ADMIN` → `200`, solo activos con ese rol.
7. `GET /api/v1/peritos/:id` con un usuario activo → `200`.
8. `GET /api/v1/peritos/999999` → `404`.
9. `GET /api/v1/peritos/hola` → `400`.
10. `DELETE /api/v1/peritos/:id` sobre el usuario creado para pruebas → `200`.
11. Repetir el GET de ese usuario → `404` (comprobación del Soft Delete).
12. Repetir el DELETE → `404`.

Para verificar directamente la baja lógica en SQLite:

```sql
SELECT id, username, active
FROM users
WHERE username = 'perito_demo';
```

El registro debe seguir existiendo con `active = 0`.

## Estructura del proyecto

```text
Tp-BackEnd/
├── forensics.db
├── package.json
├── package-lock.json
├── .gitignore
└── src/
    ├── app.js
    ├── server.js
    ├── config/
    │   └── database.js
    ├── controllers/
    │   └── peritos.controller.js
    ├── middlewares/
    │   └── errorHandler.js
    ├── models/
    │   ├── Role.js
    │   ├── User.js
    │   └── index.js
    ├── routes/
    │   └── peritos.routes.js
    ├── utils/
    │   └── logger.js
    ├── sync-db.js
    ├── seed-roles.js
    ├── test-db.js
    ├── test-users.js
    ├── test-fk.js
    └── test-invalid-role.js
```

## Alcance

El proyecto implementa una API de administración y un registro de solicitudes HTTP mediante Morgan. **No implementa autenticación, autorización por rol ni auditoría persistente de intentos de acceso no autorizado**. El rol asignado a cada usuario es un dato del sistema, no un mecanismo de control de acceso a los endpoints.

---

**Repositorio:** https://github.com/adandemarco/Tp-BackEnd
