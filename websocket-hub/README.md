# WebSocket Hub

Layanan pusat (Hub) yang menangani komunikasi real-time menggunakan Socket.IO dengan Redis Adapter untuk horizontal scaling.

## Deskripsi

Service ini berperan sebagai **WebSocket Hub** yang menerima event dari service lain via REST API dan mem-broadcast ke client (mobile/web) yang terkoneksi via Socket.IO.

## Komponen Utama

| Komponen | Deskripsi |
|---|---|
| `EventsGateway` | Menangani koneksi WebSocket, handshake, dan manajemen room (`user:{userId}`) |
| `EventsController` | REST API internal endpoint `POST /internal/events/emit` |
| `EventsService` | Logika pengiriman pesan — ke user spesifik atau broadcast ke semua client |
| `WsJwtGuard` | Validasi JWT pada setiap koneksi WebSocket |
| `RedisIoAdapter` | Menghubungkan Socket.IO dengan Redis Pub/Sub untuk distribusi antar-instance |

## Setup

```bash
npm install
cp .env.example .env
```

## Environment Variables

| Variable | Default | Deskripsi |
|---|---|---|
| `PORT` | `3000` | Port server |
| `JWT_SECRET` | - | Secret key untuk validasi JWT |
| `REDIS_HOST` | `localhost` | Host Redis |
| `REDIS_PORT` | `6379` | Port Redis |
| `REDIS_PASSWORD` | - | Password Redis |

## Menjalankan

```bash
# development (watch mode)
npm run start:dev

# production
npm run build
npm run start:prod
```

## API Endpoint

### `POST /internal/events/emit`

Mengirim event ke client yang terkoneksi.

**Request Body:**

```json
{
  "userId": "user-uuid-123",
  "event": "order:status_updated",
  "payload": {
    "orderId": "ORD-001",
    "status": "PAID"
  }
}
```

- `userId` (optional) — Jika diisi, event dikirim ke room `user:{userId}`. Jika kosong, broadcast ke semua client.
- `event` (required) — Nama event yang akan di-emit.
- `payload` (required) — Data yang dikirim ke client.

## Tech Stack

- **NestJS 11** — Framework
- **Socket.IO 4** — WebSocket engine
- **Redis** — Pub/Sub adapter (via `@socket.io/redis-adapter`)
- **JWT** — Autentikasi koneksi (via `@nestjs/jwt`)
