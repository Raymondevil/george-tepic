# George Burger - Migración a Render

Este documento describe cómo migrar el proyecto **George Burger** de Cloudflare Pages/Workers a **Render.com**.

## 📋 Resumen de Cambios

| Componente | Cloudflare | Render |
|------------|------------|--------|
| **Hosting** | Cloudflare Pages | Render Web Service + Static Site |
| **Backend** | Cloudflare Workers | Node.js con `@hono/node-server` |
| **Base de datos** | Cloudflare D1 (SQLite) | SQLite con `better-sqlite3` |
| **Runtime** | Workers | Node.js 20+ |

## 🚀 Pasos para Deploy a Render

### 1. Preparar el Repositorio

El repositorio ya está configurado para Render. Solo necesitas:

```bash
# Instalar dependencias
npm install

# Instalar dependencias de desarrollo (para build)
npm install -D
```

### 2. Configurar la Base de Datos

#### Opción A: Usar SQLite local (recomendado para Render)

Render soporta archivos persistentes, así que SQLite funciona correctamente.

```bash
# Crear la base de datos y aplicar el seed
npm run db:seed
```

Esto creará el archivo `database.sqlite` con todos los datos iniciales.

#### Opción B: Migrar datos desde Cloudflare D1

Si necesitas migrar los datos existentes desde Cloudflare D1:

1. Exportar datos de D1:
```bash
# Ejecutar en tu entorno local con Cloudflare
wrangler d1 execute george-burger-production --local --file=./export.sql
```

2. Crear un script de migración personalizado para importar los datos a SQLite.

### 3. Crear servicios en Render

#### Servicio 1: API Backend (Web Service)

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Click en **New → Web Service**
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Name**: `george-burger-api`
   - **Region**: La más cercana a tu ubicación
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build:node`
   - **Start Command**: `npm run start`
   - **Environment Variables**:
     - `PORT`: `3000`
     - `NODE_ENV`: `production`
     - `DB_PATH`: `./database.sqlite`
   - **Auto-Deploy**: Enable (opcional)

#### Servicio 2: Frontend (Static Site)

1. Ve a [Render Dashboard](https://dashboard.render.com)
2. Click en **New → Static Site**
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Name**: `george-burger-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Auto-Deploy**: Enable (opcional)

**Nota**: Para el frontend, necesitarás configurar el API URL. Actualiza el código para apuntar a la URL de tu servicio API de Render.

### 4. Configurar Conexión entre Frontend y Backend

El frontend actualmente usa rutas relativas (`/api/...`). Para que funcione con Render:

- **Opción A**: Usar un dominio personalizado y configurar CORS
- **Opción B**: Modificar el frontend para usar la URL completa del API

En `src/views/...` o donde hagas llamadas a la API, cambia:
```javascript
// De:
fetch('/api/menu')

// A:
const API_URL = process.env.API_URL || 'https://george-burger-api.onrender.com'
fetch(`${API_URL}/api/menu`)
```

### 5. Deploy y Test

1. Espera a que ambos servicios se construyan
2. Accede a tu Static Site URL
3. Prueba todas las funcionalidades:
   - Ver menú
   - Hacer un pedido
   - Verificar que los datos se guardan
   - Probar el login admin

## 🛠 Configuración Adicional

### Variables de Entorno Recomendadas

```bash
# Producción
PORT=3000
NODE_ENV=production
DB_PATH=./database.sqlite
ADMIN_PASSWORD=nueva_contraseña_segura
```

### Para Desarrollo Local

```bash
# Instalar dependencias
npm install

# Crear base de datos local
npm run db:seed

# Iniciar servidor de desarrollo
npm run dev:node

# O para producción local
npm run build:node
npm run start
```

El servidor estará disponible en `http://localhost:3000`

### Monitoreo de Logs

En Render, puedes ver los logs de tu servicio en:
- Dashboard → Tu servicio → Logs

## 💡 Consideraciones

### Persistencia de SQLite en Render
- Render monta un volumen persistente en `/opt/render/project`
- El archivo `database.sqlite` se guardará allí automáticamente
- No necesitas configuración adicional para persistencia

### Escala
- Render escalará tu servicio automáticamente
- SQLite funciona bien para aplicaciones de tamaño pequeño a mediano
- Para alta concurrencia, considera migrar a PostgreSQL

### PostgreSQL (Opcional)

Si prefieres usar PostgreSQL en lugar de SQLite:

1. Crea una base de datos PostgreSQL en Render
2. Instala `pg`:
```bash
npm install pg
```

3. Modifica `src/db.ts`:
```typescript
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export const db = {
  prepare: (sql: string) => ({
    bind: (params: any[]) => ({
      run: async () => {
        const client = await pool.connect()
        try {
          const result = await client.query(sql, params)
          return { lastInsertRowid: result.rows[0]?.id, meta: { last_row_id: result.rows[0]?.id } }
        } finally {
          client.release()
        }
      },
      first: async () => {
        const client = await pool.connect()
        try {
          const result = await client.query(sql, params)
          return result.rows[0]
        } finally {
          client.release()
        }
      },
      all: async () => {
        const client = await pool.connect()
        try {
          const result = await client.query(sql, params)
          return result.rows
        } finally {
          client.release()
        }
      }
    })
  })
}
```

## 🔧 Solución de Problemas

### Error: "Database is locked"
```bash
# Esto puede pasar con SQLite en entornos concurrentes
# Solución: Usar modo WAL
```

En `src/db.ts`, descomenta:
```typescript
db.pragma('journal_mode = WAL')
```

### Error: "Cannot find module 'better-sqlite3'"
```bash
# Instalar dependencias nativas
npm rebuild better-sqlite3
```

En Render, esto se maneja automáticamente durante el build.

### La base de datos no persiste
Asegúrate de que:
1. `DB_PATH` apunte a `./database.sqlite`
2. El archivo no esté en `.gitignore` (ya está configurado)

## 📞 Contacto

Si tienes problemas con la migración, revisa:
1. Los logs de Render
2. El archivo `.env` en tu servicio
3. La conexión a la base de datos

---

**Nota**: Este proyecto ahora es compatible tanto con Cloudflare Workers como con Node.js en Render. Puedes cambiar entre ambos según tus necesidades.
