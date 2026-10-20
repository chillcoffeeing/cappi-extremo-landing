# Despliegue (landing): scripts/deploy.sh

Desde PowerShell: `.\scripts\deploy.ps1 <opciones>` (usa Git Bash). Lee el `.env` de la
raíz del monorepo (`../.env`). Sirve para el primer despliegue y para las actualizaciones.

```powershell
.\scripts\deploy.ps1 --dry-run     # build + comprobaciones + paquete, sin conectar
.\scripts\deploy.ps1               # build + subir + publicar (pide escribir PUBLICAR)
.\scripts\deploy.ps1 --skip-build  # publica el dist/ que ya existe
.\scripts\deploy.ps1 --rollback    # restaura el último respaldo del servidor
```

- Destino: `~/cappixtremo.com (nunca public_html/)`.
- El paquete se sube como un solo `.tgz`, se verifica con sha256 y se descomprime aparte; si la subida se corta, lo publicado no se toca.
- Respaldo de lo publicado en `~/deploy/landing/backups/` (se conservan 5).
- Publica **encima sin borrar**: `_astro/` con hashes viejos sigue sirviendo a pestañas o cachés con la versión anterior. Primero sube los recursos y al final los `.html`.
- Nunca toca `.htaccess`, `.well-known` ni `cgi-bin`.
- Las páginas que ya no están en el build no se borran: el script las lista como huérfanas.

Variables opcionales del `.env`: LANDING_PATH_FOR_DEPLOY (cappixtremo.com), LANDING_URL_FOR_DEPLOY (https://www.cappixtremo.com). `DOMAIN_ROOT_FOR_DEPLOY`/`DOMAIN_FOR_DEPLOY` no se usan (son de otro proyecto).
