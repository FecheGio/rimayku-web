# MEMORY — Ediciones Rimayku Web

> Archivo de contexto del proyecto. Actualizarlo al compactar la conversación.
> Última actualización: Abril 2025

---

## Proyecto

Landing page + CMS editorial para **Ediciones Rimayku** (editorial argentina independiente).

**Repo GitHub:** https://github.com/FecheGio/rimayku-web  
**Deploy:** https://rimayku-web.vercel.app  
**Panel CMS:** https://rimayku-web.vercel.app/admin  
**Usuario GitHub:** FecheGio  

---

## Stack

- HTML + CSS + JS vanilla (sin framework, sin build step)
- Vercel (hosting + serverless functions para OAuth)
- Sveltia CMS (panel editorial, reemplazó Decap CMS por bug de React 18)
- GitHub como backend del CMS (commits automáticos al editar contenido)
- Contenido en `content/*.json` (leído via fetch() en el cliente)

---

## Identidad visual (manual de marca)

- **Colores:** Negro `#111111`, Ceibo `#C4003A`, Blanco `#FAFAFA`, Noche `#0C0C0C`
- **Tipografías:** Unbounded (títulos/display) + Cormorant Garamond italic (cuerpo)
- **Logo:** `RI·MAY·KU` en mayúsculas, sílaba MAY en ceibo rojo
- **Voz:** directa, sin corporativismos, primera persona plural

---

## Estructura de archivos

```
/
├── index.html              # Home
├── styles.css              # CSS compartido (nav, footer, animaciones)
├── favicon.png / .ico
├── vercel.json
├── MEMORY.md               # Este archivo
├── catalogo/
│   ├── colecciones.html
│   ├── libros.html
│   └── autores.html
├── content/                # Contenido editable por el CMS
│   ├── libros.json
│   ├── autores.json
│   └── novedades.json
├── admin/
│   └── index.html          # Panel Sveltia CMS (config inline)
└── api/                    # Serverless functions Vercel
    ├── auth.js             # Inicia OAuth con GitHub
    └── callback.js         # Recibe token y lo envía al CMS
```

---

## Secciones del sitio (index.html)

1. **Home** — Hero split (negro/ceibo), logo RI·MAY·KU en sílabas
2. **¿Quiénes somos?** — Pilares (Raíz / Voz / Territorio) + etimología Rimayku
3. **Novedades** — Grid asimétrico, render desde `content/novedades.json`
4. **Newsletter** — Form propio que abre `rimayku.substack.com` con email prellenado
5. **Tengo cosas para decir** — Formulario de envío de manuscritos

## Secciones del catálogo

- `/catalogo/colecciones.html` — 3 colecciones editoriales
- `/catalogo/libros.html` — Grid con filtros por colección, render desde `content/libros.json`
- `/catalogo/autores.html` — Cards de autores, render desde `content/autores.json`

---

## CMS (Sveltia CMS + GitHub OAuth)

**Cómo funciona:**
1. Editor entra a `/admin`
2. Sveltia CMS llama a `/auth` → redirige a GitHub OAuth
3. GitHub redirige a `/callback` → `api/callback.js` intercambia code por token
4. El CMS usa el token para hacer commits al repo via GitHub API
5. Cada commit dispara un redeploy automático en Vercel

**Colecciones configuradas:**
- Novedades → `content/novedades.json`
- Libros → `content/libros.json`
- Autores → `content/autores.json`

**Variables de entorno en Vercel (settings > environment variables):**
- `GITHUB_CLIENT_ID` = `Ov23li1s53LTaH5dDMao`
- `GITHUB_CLIENT_SECRET` = (pendiente que el usuario lo agregue)

**GitHub OAuth App:**
- Client ID: `Ov23li1s53LTaH5dDMao`
- Callback URL debe ser: `https://rimayku-web.vercel.app/callback`

---

## Nav

```
RI·MAY·KU | Home | Quiénes somos | Catálogo ▾ | Tengo cosas para decir
                                    Colecciones
                                    Todos los libros
                                    Autores
```

Dropdown: click-based (no hover) para evitar que se cierre al mover el mouse al menú.

---

## Estado pendiente

- [ ] El usuario todavía no agregó `GITHUB_CLIENT_SECRET` en Vercel
- [ ] El usuario todavía no actualizó el callback URL en la OAuth App de GitHub a `/callback`
- [ ] Conectar formulario "Tengo cosas para decir" (pendiente para próxima sesión)
- [ ] Reemplazar contenido de ejemplo (libros/autores/novedades) con datos reales
- [ ] Reemplazar URL del Substack con la publicación real cuando esté activa
- [ ] Agregar dominio propio (rimayku.com.ar) en Vercel

---

## Decisiones técnicas tomadas

- **Sin build step:** el sitio es HTML puro. El contenido se carga con fetch() desde JSON. Vercel redeploya pero no necesita compilar nada — el deploy es instantáneo.
- **Sveltia CMS en lugar de Decap CMS:** Decap CMS v3 tiene un bug de `removeChild` con React 18 que no tiene fix conocido.
- **PKCE descartado:** GitHub no soporta PKCE para OAuth apps públicas. Se usa OAuth estándar con proxy serverless en Vercel.
- **Form propio para Substack:** el widget oficial de Substack inyecta un `;` suelto al DOM (bug conocido).
- **Dropdown click-based:** el hover de CSS cerraba el menú antes de que el usuario pudiera seleccionar una opción.
