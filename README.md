# portomoran

Portofolio statis dengan full production stack — Docker + Cloudflare Tunnel + Prometheus + Grafana.

## Struktur

```
portomoran/
├── src/                         ← File HTML/CSS/JS Anda
├── nginx/nginx.conf             ← Nginx config (di dalam container)
├── monitoring/
│   ├── prometheus.yml
│   ├── alert.rules
│   └── alertmanager.yml
├── Dockerfile
├── docker-compose.yml           ← Base (termasuk cloudflared)
├── docker-compose.override.yml  ← Lokal (otomatis aktif)
├── docker-compose.prod.yml      ← Production
├── .github/workflows/deploy.yml ← CI/CD
├── .env.example
├── .gitignore
└── hosts
```

## Cara kerja koneksi domain

```
User → Cloudflare (SSL otomatis) → cloudflared tunnel → container app
```

Tidak perlu buka port 80/443, tidak perlu Nginx di host, tidak perlu Certbot.

---

## Setup Cloudflare Tunnel (lakukan sekali)

1. Buka https://one.dash.cloudflare.com
2. Masuk ke **Zero Trust → Networks → Tunnels**
3. Klik **Create a tunnel** → beri nama `portomoran`
4. Pilih connector **Docker** → **salin token** yang muncul
5. Pada bagian **Public Hostname**, isi:
   - Subdomain: `www` (atau kosong untuk apex domain)
   - Domain: domain Anda
   - Service: `http://app:80`
6. Simpan

Token tersebut masukkan ke `.env` sebagai `CLOUDFLARE_TUNNEL_TOKEN`.

---

## Development lokal

```bash
cp .env.example .env
# Lokal tidak butuh CLOUDFLARE_TUNNEL_TOKEN
docker compose up
# Buka http://localhost:8080
```

## Setup Production (lakukan sekali di server)

```bash
# Clone repo
git clone https://github.com/USERNAME/portomoran /opt/portomoran
cd /opt/portomoran

# Isi environment
cp .env.example .env
nano .env   # isi semua nilai, terutama CLOUDFLARE_TUNNEL_TOKEN

# Jalankan
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

Setelah ini domain Anda langsung bisa diakses.

## Deploy berikutnya

Cukup push ke `main` — GitHub Actions otomatis build, push image, dan deploy ke server.

## GitHub Secrets yang dibutuhkan

| Secret | Keterangan |
|---|---|
| `SERVER_HOST` | IP server |
| `SERVER_USER` | User SSH |
| `SSH_PRIVATE_KEY` | Private key SSH |
| `DOMAIN` | Domain Anda (untuk health check) |

## Akses monitoring

Tambahkan tunnel hostname baru di Cloudflare untuk Grafana:
- Service: `http://grafana:3000`
- Public hostname: `monitoring.yourdomain.com`


