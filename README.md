# portomoran v2 — Full Stack Production

**Stack:** Frontend (Nginx) · Backend (Node.js/Express) · PostgreSQL · Redis · Prometheus · Grafana · Cloudflare Tunnel · GitHub Actions CI/CD

---

## Arsitektur

```
Internet
   │
Cloudflare Tunnel
   ├── moran-porto.my.id          → Frontend (Nginx + HTML/CSS/JS)
   └── api.moran-porto.my.id      → Backend (Node.js + Express)

Monitoring (akses via IP langsung):
   ├── SERVER_IP:3000              → Grafana
   └── SERVER_IP:9090              → Prometheus

Docker Services:
   ├── app          (Nginx frontend)
   ├── api          (Node.js Express)
   ├── db           (PostgreSQL)
   ├── redis        (Caching)
   ├── prometheus
   ├── grafana
   ├── alertmanager
   ├── nginx-exporter
   └── cloudflared
```

---

## API Endpoints

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/metrics` | Prometheus metrics |
| POST | `/api/contact` | Kirim pesan kontak |
| GET | `/api/projects` | Ambil daftar projects |
| GET | `/api/stats` | Statistik (contacts, projects) |

---

## Setup Production

### 1. Tambah DNS record di Cloudflare

| Type | Name | Content | Proxy |
|---|---|---|---|
| CNAME | `api` | `16244a0d-d471-4fec-ad83-50876beb56e2.cfargotunnel.com` | ✅ |

### 2. Update cloudflared config di server
```bash
cp cloudflared-config.yml /home/moran/.cloudflared/config.yml
docker compose -f docker-compose.yml \
               -f docker-compose.prod.yml \
               up -d --no-deps --force-recreate cloudflared
```

### 3. Isi .env dan deploy
```bash
cd /opt/portomoran
cp .env.example .env
nano .env   # isi semua nilai

# Build image
docker build -t ghcr.io/moran2-cyber/portomoran:latest .
docker build -t ghcr.io/moran2-cyber/portomoran-api:latest ./api

# Deploy semua
docker compose -f docker-compose.yml \
               -f docker-compose.prod.yml up -d
```

### 4. Akses monitoring
```
http://SERVER_IP:3000   → Grafana
http://SERVER_IP:9090   → Prometheus
```

---

## Development Lokal

```bash
cp .env.example .env
docker compose up

# Akses:
# http://localhost:8080  → Frontend
# http://localhost:4000  → API
# http://localhost:3000  → Grafana
# http://localhost:9090  → Prometheus
```

---

## Contoh penggunaan API

```javascript
// Kirim pesan kontak dari frontend
const response = await fetch('https://api.moran-porto.my.id/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Budi',
    email: 'budi@email.com',
    message: 'Halo Moran!'
  })
});

// Ambil projects
const projects = await fetch('https://api.moran-porto.my.id/api/projects');
```
