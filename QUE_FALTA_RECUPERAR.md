# Qué Tengo y Qué Falta Recuperar — Notificas

**Fecha:** 2026-05-11
**Contexto:** Auditoría forense completa de `c:\DEV\backup-notificas\`

---

## HALLAZGO CRÍTICO

**El backend NestJS completo SÍ existe en este backup**, en la rama `development` del repo bare `repos/api.git`. La rama `master` solo tiene un boilerplate vacío, pero `development` contiene toda la lógica de negocio, entities, migraciones, auth JWT, blockchain, mailing y más.

Además, los archivos `.env` commiteados en esa rama contienen **credenciales reales** (staging) que revelan toda la infraestructura.

---

## 1. INVENTARIO COMPLETO — QUÉ TENGO LOCALMENTE

### A. Frontend Angular/Ionic (COMPLETO)

| Asset | Estado | Ubicación |
|-------|--------|-----------|
| Código fuente completo | OK | `extracted/notificas-app-src/src/` |
| 20 páginas, 12 servicios, 1 interceptor | OK | `src/app/` |
| angular.json, tsconfig, ionic.config | OK | Raíz proyecto |
| package.json + package-lock.json | OK | Raíz proyecto |
| node_modules instalados | OK | Funcional con Node 22 |
| Assets (iconos, fuentes, imágenes) | OK | `src/assets/` (~7310 archivos) |
| CI/CD pipeline GitLab | OK | `CI/.gitlab-ci.yml` |
| Terraform infra (S3 + CloudFront) | OK | `infra/` |
| Firebase Hosting config | OK | `firebase.json`, `.firebaserc` |
| **Compila y sirve en localhost:4200** | OK | Verificado |

### B. Backend NestJS (COMPLETO — en rama `development` de `repos/api.git`)

| Asset | Estado | Ubicación |
|-------|--------|-----------|
| NestJS app completa (v7) | OK | `repos/api.git` rama `development` |
| 21 entities TypeORM | OK | `src/entities/*.entity.ts` |
| 9 migraciones DDL | OK | `src/migrations/*.ts` |
| ~20 controllers + services | OK | `src/` (document, user, proof, transaction, etc.) |
| Auth JWT (Passport + bcryptjs) | OK | `src/auth/` |
| AWS S3 service (presigned URLs) | OK | `src/aws/` |
| Blockchain Hyperledger Fabric | OK | `src/blockchain/` |
| SES Mailing service + templates | OK | `src/mailing/` |
| PDF templates (HTML) | OK | `pdf_template/` |
| Scheduler service | OK | `src/schedule/` |
| serverless.yml (Lambda deploy) | OK | Raíz backend |
| docker-compose.yml (CI) | OK | `CI/docker-compose.yml` |
| Terraform infra backend (RDS, EC2, S3) | OK | `infra/` dentro del backend |
| Swagger config | OK | `src/swagger.ts` |
| Wallet Hyperledger | OK | `wallet/*.id` |
| package.json (v1.0.65) | OK | Raíz backend |

### C. Otros repos (COMPLETOS como mirrors bare)

| Repo | Contenido | Ubicación |
|------|-----------|-----------|
| `smartcontract.git` | Solidity/Hardhat para LACChain | `repos/smartcontract.git` |
| `website.git` | Sitio institucional estático | `repos/website.git` |
| `notificas-app.git` | Frontend (mirror del extracted) | `repos/notificas-app.git` |

### D. Configuraciones encontradas (con valores reales)

> **ALERTA DE SEGURIDAD:** Los archivos `.env` commiteados en `repos/api.git` rama `development` contienen credenciales reales. NO deben subirse a GitHub.

| Configuración | Encontrada | Fuente |
|---------------|-----------|--------|
| RDS hostname (staging) | SI | `.env` en api.git:development |
| RDS username/password (staging) | SI | `.env` en api.git:development |
| RDS database name | SI (`notifica`) | `.env` en api.git:development |
| RDS port | SI (`5432`) | `.env` en api.git:development |
| AWS Access Key ID | SI | `.env` en api.git:development |
| AWS Secret Access Key | SI | `.env` en api.git:development |
| S3 bucket multimedia (staging) | SI | `.env` en api.git:development |
| MercadoPago access token | SI | `.env` en api.git:development |
| JWT secret | SI (hardcodeado en código) | `src/auth/jwt.info.ts` |
| JWT expiration | SI (`180m`) | `src/auth/jwt.info.ts` |
| SES no-reply email | SI | `.env.staging` |
| Blockchain API URL | SI | `.env` en api.git:development |
| Email relay URL | SI | `.env` (servicio Ferozo) |
| API Gateway IDs (prod/staging) | SI | `CI/env.sh` en ambos repos |
| Firebase project ID | SI (`notificasvieja`) | `.firebaserc` |
| ACM Certificate ARNs | SI | Terraform variables |
| AWS Account ID | SI (`161855868410`) | Terraform + ARNs |
| Google Analytics tag | SI (`UA-78470863-3`) | `index.html` |
| Contact email | SI (`contacto@notificas.com`) | `.env` backend |

### E. Infraestructura documentada

| Recurso AWS | Identificado | Fuente |
|-------------|-------------|--------|
| API Gateway prod | `15cbaeaij4` | `CI/env.sh` |
| API Gateway staging | `9lh6ez2ztd` | `CI/env.sh` |
| API Gateway blockchain | `uia31ty4o9` | `.env` backend |
| RDS staging endpoint | `notificas-staging-database.cz3hrid9ckum.us-east-1.rds.amazonaws.com` | `.env` backend |
| S3 bucket multimedia (staging) | Identificado en `.env` | `.env` backend |
| S3 buckets frontend | `app.notificas.com`, `preprod.notificas.com` | Terraform |
| S3 Terraform state | `terraform-alberione-main` | Terraform |
| DynamoDB locking | `alberione-terraform-remote-locking` | Terraform |
| CloudFront distributions | 2 (prod + staging) | Terraform |
| ACM Certificates | 2 ARNs | Terraform |
| Lambda function | `notificas-api` (nodejs18.x) | `serverless.yml` |

### F. Herramientas de auditoría (creadas por vos)

| Herramienta | Ubicación |
|-------------|-----------|
| Script auditoría AWS read-only | `aws/run-readonly-audit.ps1` |
| Script resumen censurado | `aws/summarize-audit-censored.ps1` |
| Política IAM auditor | `aws/policies/aws-audit-readonly-policy.json` |
| Scanner local de recuperación | `scripts/Invoke-LocalRecoveryScan.ps1` |
| Descarga presigned URLs | `scripts/Get-PresignedAsset.ps1` |
| Manifesto SHA256 | `scripts/New-RecoveryManifestSha256.ps1` |
| README de recuperación | `README_LOCAL_RECOVERY.md` |
| Documentación en evidencia/ | 11 archivos (auditorías, modelo funcional, checklists) |

---

## 2. QUÉ FALTA — PEDIRLE AL PROVEEDOR O RECUPERAR DE AWS

### CRÍTICO (sin esto no se levanta el sistema)

| Artefacto faltante | Por qué es necesario | Cómo obtenerlo |
|--------------------|---------------------|----------------|
| **Dump de PostgreSQL (producción)** | Sin datos no hay servicio. Las migraciones solo crean estructura vacía. | `pg_dump` contra el RDS de producción, o `aws rds create-db-snapshot` + export |
| **Credenciales de producción** | Los `.env` encontrados son de staging. Los de prod tienen placeholders. | `aws lambda get-function-configuration` del Lambda de producción, o `aws secretsmanager` |
| **RDS endpoint de producción** | Solo tenemos el de staging | Idem anterior |
| **S3 bucket multimedia de producción** | Solo tenemos el nombre del bucket de staging | Idem anterior |

### IMPORTANTE (necesario para funcionalidad completa)

| Artefacto faltante | Por qué es necesario | Cómo obtenerlo |
|--------------------|---------------------|----------------|
| **Archivos multimedia de S3** | PDFs, adjuntos jurídicos de los usuarios | `aws s3 sync s3://BUCKET_NAME ./multimedia-backup/` |
| **Terraform state** | Para gestionar infra existente sin recrear | `terraform state pull` desde `terraform-alberione-main` |
| **Docker images de GitLab** | Para reproducir builds exactos | `docker pull registry.gitlab.com/alberione/notificas/...` |
| **Configuración MercadoPago producción** | Token de prod puede ser diferente al de staging | Lambda env vars o Secrets Manager |
| **Configuración blockchain producción** | URL del API Gateway blockchain en prod | Lambda env vars |

### DESEABLE (para operación completa)

| Artefacto faltante | Cómo obtenerlo |
|--------------------|----------------|
| Terraform state de producción | `terraform state pull` |
| CloudWatch logs históricos | `aws logs get-log-events` |
| Configuración DNS (Route53 o externo) | Panel del proveedor de dominio |
| Certificados SSL (ACM) | Se pueden regenerar si se controla el dominio |
| GitLab CI/CD Variables | Panel de GitLab (si aún hay acceso) |

---

## 3. VARIABLES DE ENTORNO — MAPA COMPLETO

Variables encontradas en `.env` del backend (rama `development`):

| Variable | Staging (encontrada) | Producción |
|----------|---------------------|------------|
| `TYPEORM_CONNECTION` | `postgres` | `postgres` |
| `TYPEORM_HOST` | **Valor real encontrado** | `DB_ENDPOINT` (placeholder) |
| `TYPEORM_USERNAME` | **Valor real encontrado** | `DB_USERNAME` (placeholder) |
| `TYPEORM_PASSWORD` | **Valor real encontrado** | `DB_PASSWORD` (placeholder) |
| `TYPEORM_DATABASE` | `notifica` | `DB_DATABASE` (placeholder) |
| `TYPEORM_PORT` | `5432` | `DB_PORT` (placeholder) |
| `TYPEORM_SYNCHRONIZE` | `false` | `false` |
| `TYPEORM_LOGGING` | `error` | `error` |
| `APP_URL_HOST` | `https://preprod.notificas.com` | `https://app.notificas.com` |
| `APP_ENV` | `staging` | `production` |
| `APP_URL_RECOVER` | `/recover` | `/recover` |
| `APP_URL_READER_DOC` | `/reader` | `/reader` |
| `EMAIL_URL` | **Valor real encontrado** (Ferozo) | Mismo |
| `MY_AWS_KEY_ID` | **Valor real encontrado** | Mismo |
| `MY_AWS_SECRET_KEY` | **Valor real encontrado** | Mismo |
| `AWS_BUCKET` | **Valor real encontrado** | `STORAGE_BUCKET` (placeholder) |
| `AWS_BUCKET_URL` | API Gateway prod URL | Mismo |
| `MP_ACCESS_TOKEN` | **Valor real encontrado** | Mismo (¿o diferente?) |
| `BLOCKCHAIN_URL` | API Gateway blockchain staging | Mismo |
| `REGION` | `us-east-1` | `us-east-1` |
| `NO_REPLY_MAIL` | `Notificas <no-reply@notificas.com>` | Mismo |
| `CONTACT_MAIL` | `contacto@notificas.com` | `contacto@notificas.com` |
| `API_URL` | API Gateway staging URL | Falta |
| `SES_NO_REPLY_EMAIL` | **Valor real encontrado** | No presente |

Además, hardcodeado en código:
- **JWT Secret**: en `src/auth/jwt.info.ts` (hardcoded, no en .env)
- **JWT Expiration**: `180m` (3 horas)

---

## 4. ENTIDADES TypeORM (esquema de base de datos)

21 entities encontradas en `repos/api.git` rama `development`:

| Entity | Tabla inferida |
|--------|---------------|
| `configuration.entity.ts` | `configuration` |
| `document.entity.ts` | `document` |
| `document-status.entity.ts` | `document_status` |
| `document-template.entity.ts` | `document_template` |
| `document-type.entity.ts` | `document_type` |
| `document-user.entity.ts` | `document_user` |
| `document-user-type.entity.ts` | `document_user_type` |
| `multimedia.entity.ts` | `multimedia` |
| `notification.entity.ts` | `notification` |
| `notification-type.entity.ts` | `notification_type` |
| `notification-user.entity.ts` | `notification_user` |
| `proof.entity.ts` | `proof` |
| `proof-state.entity.ts` | `proof_state` |
| `proof-type.entity.ts` | `proof_type` |
| `transaction.entity.ts` | `transaction` |
| `transaction-type.entity.ts` | `transaction_type` |
| `user.entity.ts` | `user` |
| `user.view.entity.ts` | Vista de usuario |
| `user-group.entity.ts` | `user_group` |
| `user-type.entity.ts` | `user_type` |
| `user-user.entity.ts` | `user_user` (contactos) |

9 migraciones DDL (2020-12 a 2021-03) que crean la estructura de tablas.

---

## 5. STACK BACKEND COMPLETO (confirmado)

| Componente | Tecnología | Versión |
|-----------|-----------|---------|
| Framework | NestJS | 7.x |
| ORM | TypeORM | 0.2.41 |
| Base de datos | PostgreSQL | vía `pg` 8.5.1 |
| Auth | Passport + JWT | passport 0.4, @nestjs/jwt 7.2 |
| Hashing | bcryptjs | 2.4.3 |
| AWS SDK | aws-sdk | 2.1306.0 |
| Serverless | Serverless Framework | con `serverless-offline` |
| Deploy | AWS Lambda | nodejs18.x |
| Blockchain | Hyperledger Fabric | fabric-network 2.2.8 |
| Email | AWS SES + relay externo | Ferozo SMTP |
| Pagos | MercadoPago | via API REST |
| PDF | HTML templates | `pdf_template/` |
| API docs | Swagger | @nestjs/swagger 4.5 |
| TypeScript | 4.5.5 | |

---

## 6. NIVEL DE RECUPERABILIDAD

### Escenario A: Con acceso a AWS (mejor caso)

| Componente | Recuperable | Esfuerzo |
|-----------|------------|----------|
| Frontend | 100% | Ya funciona en localhost:4200 |
| Backend código | 100% | Extraer de `repos/api.git` rama `development` |
| Esquema DB | 100% | 9 migraciones TypeORM + 21 entities |
| Datos DB | Depende | Necesita `pg_dump` del RDS |
| Archivos multimedia | Depende | Necesita `aws s3 sync` del bucket |
| Infra completa | 90% | Terraform + serverless.yml disponibles |
| Credenciales producción | Necesita acceso | `lambda get-function-configuration` |

**Viabilidad: 90-95% si se tiene acceso a la cuenta AWS.**

### Escenario B: Sin acceso a AWS ni al proveedor

| Componente | Recuperable | Esfuerzo |
|-----------|------------|----------|
| Frontend | 100% | Ya funciona |
| Backend código | 100% | Código completo disponible |
| Esquema DB | 100% | Se puede recrear la DB vacía con migraciones |
| Datos DB | 0% | Perdidos sin dump |
| Archivos multimedia | 0% | Perdidos sin acceso a S3 |
| Credenciales staging | 100% | Ya están en los `.env` del backup |
| Blockchain history | 0% | Requiere acceso a LACChain |

**Viabilidad: 70% — Sistema funcional pero vacío (sin datos históricos ni archivos).**

### Escenario C: Reconstrucción total sin proveedor

| Acción | Esfuerzo estimado |
|--------|------------------|
| Levantar frontend en cualquier hosting | 1 día |
| Levantar backend NestJS en VPS/Lambda propio | 2-3 días |
| Crear PostgreSQL vacía con migraciones | 1 día |
| Configurar S3 para multimedia | 1 día |
| Configurar auth JWT | Ya está en el código |
| Reconfigurar MercadoPago (cuenta nueva) | 1-2 días |
| Reconectar blockchain LACChain | 3-5 días (complejo) |
| Migrar dominio notificas.com | 1-3 días (depende del registrar) |
| **Total estimado** | **~2 semanas para MVP sin datos históricos** |

---

## 7. PASOS INMEDIATOS RECOMENDADOS

### Paso 1: Extraer el backend del repo bare (URGENTE)

```bash
cd c:\DEV\backup-notificas
git clone -b development repos/api.git extracted/notificas-api
```

Esto crea una copia de trabajo del backend completo.

### Paso 2: Pedir al proveedor (si hay acceso)

1. **Dump de PostgreSQL producción** — Es lo más importante. Sin datos, el sistema es una cáscara vacía.
2. **Sync del bucket multimedia de producción** — Archivos jurídicos de los usuarios.
3. **Variables de entorno de Lambda producción** — Para conocer credenciales de prod.

### Paso 3: Seguridad URGENTE

Los `.env` con credenciales reales están en el historial git de `repos/api.git`. Si se sube este repo a GitHub:
- **NUNCA subir `repos/api.git` tal cual** — contiene secrets en el historial.
- Al extraer el backend, crear un `.gitignore` que excluya `.env`, `.env.*`, `wallet/`.
- Rotar las credenciales AWS si la cuenta sigue activa (las keys están expuestas en el repo).

### Paso 4: Verificar si las credenciales de staging siguen activas

Las credenciales encontradas en `.env` (staging) podrían seguir funcionando. Si es así:
- Se puede hacer `pg_dump` de la DB de staging como punto de partida.
- Se puede hacer `aws s3 ls` para inventariar los buckets.
- Se puede hacer `aws lambda get-function-configuration` para obtener vars de producción.

---

## 8. RESUMEN EJECUTIVO

| Pregunta | Respuesta |
|----------|-----------|
| ¿Tengo el frontend? | **SÍ, completo y funcional** |
| ¿Tengo el backend? | **SÍ, completo en `repos/api.git` rama `development`** |
| ¿Tengo el esquema de DB? | **SÍ, 21 entities + 9 migraciones TypeORM** |
| ¿Tengo los datos de la DB? | **NO — necesito dump de PostgreSQL** |
| ¿Tengo los archivos multimedia? | **NO — necesito sync de S3** |
| ¿Tengo credenciales? | **SÍ (staging), PARCIAL (producción tiene placeholders)** |
| ¿Tengo la infra como código? | **SÍ (Terraform + serverless.yml para front y back)** |
| ¿Tengo el smart contract? | **SÍ, en `repos/smartcontract.git`** |
| ¿Puedo levantarlo sin el proveedor? | **SÍ, pero sin datos históricos (~2 semanas)** |
| ¿Puedo levantarlo CON acceso a AWS? | **SÍ, con datos (~3-5 días)** |

---

*Informe generado el 2026-05-11 sobre el backup en `c:\DEV\backup-notificas\`*
