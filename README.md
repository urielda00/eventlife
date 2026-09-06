# EventLife HomeLab deployment

The production frontend remains deployed independently on Netlify. API traffic
will flow through Cloudflare Tunnel to the loopback-only HomeLab listener:

```text
Netlify -> Cloudflare Tunnel -> 127.0.0.1:5003
        -> eventlife-backend:8080 -> eventlife-db:5432
```

The Compose stack contains only PostgreSQL 17 and the Spring Boot backend. The
database has no published host port; both containers share an internal Docker
network, and PostgreSQL data persists in the `eventlife_postgres-data` named
volume. Container names are scoped to EventLife (`eventlife-db` and
`eventlife-backend`).

## Environment

Create `/srv/eventlife/.env` from `.env.example` and replace every placeholder.
The file must define PostgreSQL database/user/password values, matching Spring
datasource values, a random JWT secret of at least 32 bytes, the exact production
Netlify origin, the one-hour JWT expiration, port `8080`, the `prod` profile,
Hibernate `validate`, disabled SQL display, and framework forward-header handling.
Restrict the populated file to the deployment account and do not commit it.

## Fresh database startup

This deployment is for a fresh database only. Do not restore `backup_final.sql`.
On the backend's first start, Flyway applies the versioned baseline migration;
Hibernate then validates the mapped schema and never creates or updates it.
Compose waits for PostgreSQL's `pg_isready` check before starting the backend.

From the directory containing `compose.yaml`, validate and start with:

```bash
docker compose --env-file /srv/eventlife/.env config
docker compose --env-file /srv/eventlife/.env build --pull backend
docker compose --env-file /srv/eventlife/.env up -d
docker compose --env-file /srv/eventlife/.env ps
curl --fail http://127.0.0.1:5003/actuator/health
```

Only `GET /actuator/health` is public and exposed by Actuator. It includes the
database health contributor in the aggregate status while hiding component
details. A healthy response is `{"status":"UP"}`; dependency failure produces a
non-success response used by Docker's backend healthcheck.

After the local health check succeeds, configure Cloudflare Tunnel separately to
forward the public API hostname to `http://127.0.0.1:5003`. Netlify remains a
separate deployment and is not part of this Compose stack.
