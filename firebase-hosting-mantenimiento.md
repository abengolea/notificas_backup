# Firebase Hosting — frontend en modo mantenimiento

## 1. Objetivo

Publicar **solo** el frontend Angular/Ionic en **modo mantenimiento** en **Firebase Hosting** de un proyecto propio (sitio estático). No forma parte del despliegue histórico (AWS/GitLab CI/Terraform) de Notificas.

## 2. Estado actual del proyecto

- `environment.prod.ts` incluye `maintenanceBlocked: true` (build de producción).
- El build productivo (`ng build --prod`) genera la carpeta **`www`** (ver `angular.json` → `outputPath`).
- `firebase.json` usa `public: "www"` y rewrites SPA hacia `/index.html`.
- **No** se usa Firestore en esta fase (Hosting no lo exige).
- **No** se usa AWS.
- **No** se usa el GitLab CI heredado.
- **No** se ejecuta Terraform.

## 3. Comandos (orden típico)

Desde la raíz de este repo (`notificas-app`):

```bash
npm ci
npm run build
firebase login
firebase use --add
firebase deploy --only hosting
```

Tras `firebase use --add`, el CLI suele crear/actualizar `.firebaserc` con el proyecto elegido.

## 4. Prueba previa al dominio propio

1. Desplegar y abrir primero la URL de Hosting que ofrece Firebase (por ejemplo **`*.web.app`** o **`*.firebaseapp.com`**).
2. Comprobar que aparece la **pantalla / aviso de mantenimiento**.
3. Comprobar que el **login** queda bloqueado (no debe completarse el flujo hacia backend).
4. Comprobar que **no** se conecta al backend legado en AWS (esta variante está pensada para cortar uso público vía SPA, sin reutilizar ese API).

Opcional antes de Firebase: servir **`www`** en local como estático (`python -m http.server` o `npx serve`) para validar el paquete generado.

## 5. DNS — notificas.com

- **Recién después** de validar el deploy en la URL que da Firebase Hosting.
- En la consola: Hosting → dominio personalizado → seguir los pasos para **notificas.com** (y/o **www**).
- Crear solo los registros (**TXT**, **A**, **CNAME**, etc.) que **indique Firebase** en ese momento — **no inventar** valores.
- En el proveedor (Cloudflare, DonWeb, otro): alinear formato y propagación como indiquen Firebase y el proveedor.
- **No** modificar registros públicos hasta tener el deploy **probado** en la URL de Firebase.

## 6. Advertencias

- Esto **no migra** backend.
- Esto **no migra** base de datos.
- Esto **no recupera** archivos ni uploads almacenados en sistemas ajenos.
- Esto **solo** sustituye (o paraleliza con DNS) la **interfaz pública** para **bloquear** nuevas operaciones de usuario mediante la app compilada en mantenimiento.
- Migración/replicación de datos y servicios nuevos corresponden a una **fase 2**.

---

Este documento no debe contener tokens, secretos ni identificadores sensibles del proyecto Firebase; enlaza la consola y el CLI con la cuenta configurada localmente (`firebase login`).
