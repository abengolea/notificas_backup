# Auditoría Técnica — Notificas App (Legacy)

**Fecha:** 2026-05-11
**Auditor:** Cursor AI (solicitado por abengolea)
**Repositorio:** https://github.com/abengolea/notificas_backup
**Estado actual:** Modo mantenimiento (`maintenanceBlocked: true`)

---

## 1. Resumen del Stack

| Componente | Tecnología | Versión |
|---|---|---|
| **Framework frontend** | Angular | 13.1.3 |
| **UI Kit** | Ionic | 6.0.7 |
| **Lenguaje** | TypeScript | ~4.4.2 |
| **Reactive** | RxJS | ~7.5.4 |
| **Backend (inferido)** | NestJS + @nestjsx/crud | No incluido en backup |
| **Base de datos (inferida)** | PostgreSQL (probable) | Desconocida |
| **Hosting frontend (histórico)** | AWS S3 + CloudFront | Via Terraform 0.12 |
| **Hosting frontend (actual)** | Firebase Hosting | Proyecto `notificasvieja` |
| **CI/CD** | GitLab CI | 3 stages: setup/build/deploy |
| **IaC** | Terraform | 0.12.28 (obsoleto) |
| **Pagos** | MercadoPago | Via backend `/proofs/mp-checkout` |
| **Almacenamiento archivos** | AWS S3 | Presigned URLs via backend |
| **Autenticación** | JWT Bearer (propio) | Tokens en localStorage |
| **Hashing passwords** | MD5 (frontend) | INSEGURO |

---

## 2. Estructura del Proyecto

```
notificas-app-src/
├── src/
│   ├── app/
│   │   ├── app.module.ts              # Módulo raíz
│   │   ├── app-routing.module.ts      # Rutas (todas lazy-loaded)
│   │   ├── app.component.ts           # Componente raíz + lógica menú
│   │   ├── services/                  # 12 servicios + 1 interceptor
│   │   │   ├── global.service.ts      # URL API, config global
│   │   │   ├── authentication.service.ts
│   │   │   ├── authentication.interceptor.ts  # JWT Bearer
│   │   │   ├── user.service.ts        # Login, CRUD usuarios, contactos
│   │   │   ├── user-admin.service.ts  # Admin de usuarios
│   │   │   ├── document.service.ts    # CRUD documentos/notificaciones
│   │   │   ├── document-type.service.ts
│   │   │   ├── document-template.service.ts
│   │   │   ├── multimedia.service.ts  # Upload/download S3
│   │   │   ├── proof.service.ts       # Balance, MercadoPago
│   │   │   ├── transaction-type.service.ts
│   │   │   ├── user-type.service.ts
│   │   │   └── maintenance-alert.service.ts
│   │   ├── login/                     # Página de login
│   │   ├── folder/                    # Bandeja de entrada (Inbox)
│   │   ├── text-editor/               # Editor de notificaciones
│   │   ├── document-archive/          # Archivo de documentos
│   │   ├── document-template/         # Plantillas
│   │   ├── contact/                   # Contactos
│   │   ├── transaction-type/          # Tipos de transacciones
│   │   ├── user/                      # Admin usuarios + historial proofs
│   │   ├── profile/                   # Perfil del usuario
│   │   ├── current-account/           # Cuenta corriente / billetera
│   │   ├── reader/                    # Visor público de documentos
│   │   ├── download-file/             # Descarga de archivos
│   │   ├── history/                   # Historial
│   │   └── popovers/notifications/    # Popover de notificaciones
│   ├── assets/                        # ~7310 archivos (iconos, fuentes)
│   ├── environments/
│   │   ├── environment.ts             # Dev (maintenanceBlocked: true)
│   │   └── environment.prod.ts        # Prod (maintenanceBlocked: true)
│   ├── theme/variables.scss
│   ├── global.scss
│   └── index.html                     # Incluye Google Analytics UA-78470863-3
├── CI/
│   ├── .gitlab-ci.yml                 # Pipeline GitLab CI
│   ├── Dockerfile                     # Node 16.13.1 + Angular CLI 13.1.4
│   └── env.sh                         # Mapeo rama → entorno → API URL
├── infra/
│   ├── Dockerfile                     # Python 3.8 + Terraform 0.12 + AWS CLI
│   └── app/
│       ├── main/modules/              # Módulos Terraform (S3, CloudFront)
│       ├── production/                # Entrypoint Terraform producción
│       └── staging/                   # Entrypoint Terraform staging
├── e2e/                               # Tests e2e (Protractor)
├── angular.json
├── package.json
├── firebase.json
├── .firebaserc
├── ionic.config.json
├── karma.conf.js
├── tsconfig.json
├── tslint.json
└── .gitignore
```

### Cuantificación

| Tipo | Cantidad |
|---|---|
| Páginas (*.page.ts) | 20 |
| Componentes (*.component.ts) | 2 |
| Servicios (*.service.ts) | 12 |
| Interceptores | 1 |
| Módulos (*.module.ts) | ~42 |
| Guards | 0 |
| Pipes | 0 |
| Directivas | 0 |
| Modelos/Interfaces tipados | 0 |

---

## 3. Comandos para Correr Local

### Requisitos previos

- **Node.js**: Recomendado v16.x LTS (el proyecto es Angular 13). Funciona con Node 22 pero no es oficialmente soportado.
- **npm**: Incluido con Node.
- **Backend NestJS**: Debe correr en `http://localhost:3000` (NO incluido en este backup).

### Instalación y ejecución

```bash
cd extracted/notificas-app-src

# Instalar dependencias
npm install

# Levantar servidor de desarrollo (puerto 4200)
npm start
# Equivale a: ng serve
# Abrir http://localhost:4200

# Build de producción
npm run build
# Equivale a: ng build --prod (output en www/)

# Build de staging
npm run build:staging
# Equivale a: ng build (sin optimización)

# Tests unitarios
npm test

# Linting
npm run lint
```

### Desbloquear modo mantenimiento (para desarrollo)

Editar `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  maintenanceBlocked: false,  // Cambiar a false
};
```

### Nota sobre el backend

El frontend espera un backend NestJS en `http://localhost:3000` con los siguientes endpoints:

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/users/login` | Login (email + password MD5) |
| POST | `/users` | Registro |
| GET | `/users/getbytoken` | Datos del usuario actual |
| GET/POST | `/documents` | CRUD documentos |
| GET | `/documents-types` | Tipos de documentos |
| GET/POST | `/documents-templates` | Plantillas |
| GET/POST | `/transactions-types` | Tipos de transacciones |
| GET | `/users-types` | Tipos de usuarios |
| GET | `/users/contacts` | Contactos |
| GET/POST | `/admin/users` | Admin de usuarios |
| GET | `/proofs/balance` | Balance de coins |
| POST | `/proofs/mp-checkout` | Checkout MercadoPago |
| GET | `/multimedia/upload-sign-url` | Presigned URL para upload S3 |
| GET | `/multimedia/download-sign-url/:key` | Presigned URL para download S3 |

**Sin el backend, el frontend mostrará la pantalla de login pero no podrá autenticar.**

---

## 4. Variables de Entorno Necesarias

### Frontend (Angular environments)

| Variable | Archivo | Valor actual | Descripción |
|---|---|---|---|
| `production` | `environment.ts` / `environment.prod.ts` | `false` / `true` | Flag de producción |
| `maintenanceBlocked` | Ambos | `true` | Bloquea acceso (modo mantenimiento) |

### CI/CD (GitLab CI Variables)

| Variable | Dónde se usa | Descripción |
|---|---|---|
| `AWS_DEFAULT_REGION` | `.gitlab-ci.yml` | Región AWS (`us-east-1`) |
| `DB_PORT` | `.gitlab-ci.yml` | Puerto de la base de datos |
| `CI_COMMIT_REF_NAME` | `env.sh` | Rama actual (automática de GitLab) |

### Configuración inyectada en build

| Placeholder | Archivo | Cómo se inyecta | Valores conocidos |
|---|---|---|---|
| `NOTIFICAS_API` | `global.service.ts` | `sed` en CI pipeline | Prod: `https://15cbaeaij4.execute-api.us-east-1.amazonaws.com/production/` / Staging: `https://9lh6ez2ztd.execute-api.us-east-1.amazonaws.com/staging` |

### Terraform / AWS

| Variable | Descripción |
|---|---|
| `AWS_PROFILE` | Perfil AWS en `~/.aws/credentials` (era `alberione`) |
| ACM Cert ARN (prod) | `arn:aws:acm:us-east-1:161855868410:certificate/a21678e6-...` |
| ACM Cert ARN (staging) | `arn:aws:acm:us-east-1:161855868410:certificate/cfe30ac2-...` |

Ver archivo `.env.example` para la lista completa.

---

## 5. Servicios Externos Requeridos

| Servicio | Propósito | Estado | Necesario para dev local |
|---|---|---|---|
| **Backend NestJS** | API REST principal | NO incluido en backup | SI (sin él no funciona nada) |
| **PostgreSQL** (probable) | Base de datos del backend | NO incluido | SI (para el backend) |
| **AWS S3** | Almacenamiento de archivos multimedia | Cuenta `161855868410` | Solo si se usan archivos |
| **AWS CloudFront** | CDN para servir el frontend | Idem | NO (solo para deploy) |
| **AWS API Gateway** | Proxy al backend NestJS/Lambda | Idem | NO (solo en prod/staging) |
| **Firebase Hosting** | Hosting estático de emergencia | Proyecto `notificasvieja` | NO |
| **MercadoPago** | Sistema de pagos/créditos | Configurado en backend | Solo si se usa billing |
| **GitLab CI** | Pipeline de CI/CD | `registry.gitlab.com/alberione/notificas/` | NO |
| **Google Analytics** | Tracking | Tag `UA-78470863-3` | NO |

---

## 6. Riesgos Detectados

### CRÍTICOS

| # | Riesgo | Detalle | Recomendación |
|---|---|---|---|
| 1 | **Passwords hasheadas con MD5 en frontend** | `Md5.hashStr()` en `user.service.ts` y `login.page.ts` | Eliminar hash MD5 del frontend. Enviar password en texto plano sobre HTTPS. Que el backend use bcrypt/argon2. |
| 2 | **Backend NO incluido en backup** | No hay código del backend NestJS | Recuperar de GitLab o reescribir. Sin él, la app no funciona. |
| 3 | **Sin auth guards en rutas** | Todas las rutas accesibles sin protección client-side | Implementar `CanActivate` guard que verifique JWT. |

### ALTOS

| # | Riesgo | Detalle | Recomendación |
|---|---|---|---|
| 4 | **Terraform 0.12 obsoleto** | EOL, breaking changes vs 1.x | Migrar a Terraform 1.x+ (requiere refactoring de sintaxis). |
| 5 | **URLs de API Gateway hardcodeadas** | En `CI/env.sh` dentro del repo | Mover a variables de CI/CD de GitLab. |
| 6 | **ARNs y Account ID AWS expuestos** | En archivos Terraform | Mover a `terraform.tfvars` (gitignored) o variables CI. |
| 7 | **S3 bucket con ACL public-read** | Terraform config | Migrar a CloudFront OAI exclusivo, eliminar ACL pública. |
| 8 | **Terraform state sin encrypt** | `encrypt = false` en backend config | Cambiar a `encrypt = true`. |

### MEDIOS

| # | Riesgo | Detalle | Recomendación |
|---|---|---|---|
| 9 | **Angular 13 es EOL** | Sin parches de seguridad | Planificar migración a Angular 16+ o 17+. |
| 10 | **TSLint deprecado** | Reemplazado por ESLint desde 2020 | Migrar a ESLint. |
| 11 | **Protractor deprecado** | Angular lo dejó de soportar | Migrar a Cypress o Playwright. |
| 12 | **TLS mínimo v1.0 en CloudFront** | Inseguro | Subir a TLSv1.2 mínimo. |
| 13 | **Dos editores de texto (CKEditor + Quill)** | Redundante, aumenta bundle | Elegir uno y eliminar el otro. |
| 14 | **CKEditor cargado desde CDN vs paquete** | CDN v4.16.0, paquete v4.12.1 | Unificar versión. |
| 15 | **Proveedor duplicado** | `RouteReuseStrategy` registrado 2 veces en `app.module.ts` | Eliminar el duplicado. |
| 16 | **Sin modelos/interfaces tipados** | Todo es `any` | Crear interfaces TypeScript para cada entidad. |
| 17 | **`maintenanceBlocked: true` en ambos envs** | La app está bloqueada siempre | Poner `false` en dev para desarrollo. |
| 18 | **Google Analytics tag legacy (UA-)** | Universal Analytics fue deprecado por Google | Migrar a GA4 o eliminar. |

---

## 7. Entidades del Sistema

| Entidad | Endpoint | Descripción |
|---|---|---|
| **User** | `/users` | Usuarios del sistema (email, nombre, DNI, CUIT, teléfono, tipo, grupo) |
| **UserType** | `/users-types` | Tipos de usuario (ej: company) |
| **UserGroup** | — | Grupos (id=1 Administradores, id=2 Usuarios) |
| **Document** | `/documents` | Notificaciones/documentos legales (subject, body, sender, destinatarios) |
| **DocumentType** | `/documents-types` | Comunicación, Notificación, Contestación, Oferta, Intimación, Oficio Judicial |
| **DocumentTemplate** | `/documents-templates` | Plantillas reutilizables de documentos |
| **TransactionType** | `/transactions-types` | Tipos de transacciones con costo en coins |
| **Proof / Coins** | `/proofs` | Sistema de créditos/billetera, integración MercadoPago |
| **Multimedia** | `/multimedia` | Archivos adjuntos almacenados en S3 |
| **Contact** | `/users/contacts` | Contactos del usuario (otros usuarios) |

---

## 8. Arquitectura de Deploy

```
                    ┌─────────────────────────────────┐
                    │         GitLab CI/CD             │
                    │  (registry.gitlab.com/alberione) │
                    └──────┬──────────┬───────────────┘
                           │          │
                    ┌──────▼──┐  ┌────▼─────┐
                    │ Angular │  │ Terraform│
                    │  Build  │  │  Apply   │
                    │ (www/)  │  │ (S3+CF)  │
                    └──────┬──┘  └────┬─────┘
                           │          │
                    ┌──────▼──────────▼───────────────┐
                    │            AWS                    │
                    │  ┌─────┐     ┌──────────────┐   │
                    │  │ S3  │────▶│  CloudFront   │   │
                    │  │(www)│     │ (HTTPS/CDN)   │   │
                    │  └─────┘     └──────┬───────┘   │
                    │                     │            │
                    │         app.notificas.com        │
                    │      preprod.notificas.com       │
                    │                                  │
                    │  ┌──────────────┐  ┌──────────┐ │
                    │  │ API Gateway  │──│  Lambda/  │ │
                    │  │ (REST API)   │  │  NestJS   │ │
                    │  └──────────────┘  └────┬─────┘ │
                    │                         │       │
                    │                    ┌────▼─────┐ │
                    │                    │PostgreSQL│  │
                    │                    │  (RDS?)  │  │
                    │                    └──────────┘  │
                    │                                  │
                    │  ┌─────┐                         │
                    │  │ S3  │ (archivos multimedia)   │
                    │  └─────┘                         │
                    └──────────────────────────────────┘

         ┌──────────────────────────────────┐
         │   Firebase Hosting (emergencia)  │
         │   Proyecto: notificasvieja       │
         │   Solo modo mantenimiento        │
         └──────────────────────────────────┘
```

---

## 9. Pasos para Levantar en Servidor Propio

### Fase 1: Frontend (este repo)

1. Instalar Node.js 16.x LTS.
2. `npm install` en la raíz del proyecto.
3. Cambiar `maintenanceBlocked: false` en `src/environments/environment.ts`.
4. Configurar la URL de la API en `src/app/services/global.service.ts` (o usar el mecanismo de `sed` existente).
5. `npm start` para desarrollo local en `http://localhost:4200`.
6. `npm run build` para generar el build en `www/`.
7. Servir `www/` con cualquier servidor estático (nginx, Apache, Caddy, S3, Vercel, etc.).

### Fase 2: Backend (NO incluido — requiere recuperación)

1. **Recuperar el código backend** del GitLab de Alberione (`registry.gitlab.com/alberione/notificas/`).
2. El backend es NestJS con `@nestjsx/crud` y probablemente TypeORM + PostgreSQL.
3. Necesita correr en el puerto 3000 (o configurar el frontend para apuntar al puerto correcto).
4. Configurar:
   - Conexión a PostgreSQL (host, puerto, usuario, password, base de datos).
   - AWS S3 (para multimedia con presigned URLs).
   - MercadoPago (para sistema de créditos).
   - JWT secret (para autenticación).

### Fase 3: Base de Datos

1. Instalar PostgreSQL (probable).
2. Crear la base de datos.
3. Ejecutar migraciones (si se recuperan del backend).
4. Importar datos si hay dump disponible.

### Fase 4: Infraestructura (opcional, para deploy)

1. Actualizar Terraform de 0.12 a 1.x+.
2. Configurar AWS credentials.
3. Configurar CI/CD (GitHub Actions o GitLab CI).
4. Configurar dominios y certificados SSL.

---

## 10. Pasos Recomendados Antes de Pedir la Baja del Servidor Viejo

- [ ] **Verificar que se tiene backup completo del backend NestJS** (código fuente + migraciones).
- [ ] **Exportar dump de la base de datos** (PostgreSQL).
- [ ] **Descargar todos los archivos multimedia de S3** (bucket de producción).
- [ ] **Exportar Terraform state** (`terraform state pull` de ambos entornos).
- [ ] **Documentar todas las variables de CI/CD de GitLab** (las que se configuran en Settings > CI/CD > Variables).
- [ ] **Verificar que el frontend compila y sirve correctamente** desde el backup.
- [ ] **Obtener las credenciales de MercadoPago** si se va a mantener el sistema de pagos.
- [ ] **Registrar los dominios** (`notificas.com`, `app.notificas.com`, `preprod.notificas.com`) — verificar quién los controla y cómo migrar DNS.
- [ ] **Exportar las imágenes Docker** del GitLab Container Registry (`infra:0.15`, `angular:develop.13.1.4`).
- [ ] **Capturar certificados ACM** o estar preparado para emitir nuevos en la nueva cuenta AWS.
- [ ] **Verificar Google Analytics** — el tag `UA-78470863-3` pertenece a alguna cuenta, confirmar acceso.

---

## 11. Archivos que Faltan

| Archivo / Recurso | Impacto | Acción |
|---|---|---|
| **Backend NestJS completo** | CRÍTICO — sin él no hay app | Recuperar de GitLab de Alberione |
| **Dump de base de datos** | CRÍTICO — sin datos no hay servicio | Exportar antes de dar de baja |
| **README.md** | Bajo — documentación | Este archivo (`AUDITORIA_LEGACY_NOTIFICAS.md`) lo reemplaza |
| **.nvmrc** | Bajo — conveniencia | Crear con contenido `16` |
| **Auth guards** | Medio — seguridad client-side | Implementar `CanActivate` |
| **Interfaces/Modelos TypeScript** | Medio — mantenibilidad | Crear basándose en las entidades documentadas |
| **docker-compose.yml** | Medio — onboarding | Crear para levantar todo el stack local fácilmente |
| **Tests unitarios reales** | Medio — calidad | Solo existen los archivos `.spec.ts` autogenerados por Angular CLI |

---

*Reporte generado el 2026-05-11. Para preguntas o seguimiento, referirse al repositorio https://github.com/abengolea/notificas_backup*
