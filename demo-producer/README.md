# Demo Producer

Contoh service backend yang berperan sebagai **Publisher/Producer** — mengirim event ke WebSocket Hub via HTTP POST.

## Deskripsi

Service ini mensimulasikan microservice (misalnya order service, payment service) yang perlu mengirim notifikasi real-time ke client. Producer **tidak perlu** membuka koneksi WebSocket, cukup melakukan HTTP POST ke Hub.

## API Endpoint

### `POST /trigger/order-paid`

Simulasi trigger notifikasi ketika order berhasil dibayar.

**Request Body:**

```json
{
  "userId": "user-uuid-123",
  "orderId": "ORD-UV-20240507-001"
}
```

**Contoh:**

```bash
curl -X POST http://localhost:3001/trigger/order-paid \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-uuid-123", "orderId": "ORD-UV-20240507-001"}'
```

## Setup

```bash
npm install
cp .env.example .env
```

## Environment Variables

| Variable | Default | Deskripsi |
|---|---|---|
| `PORT` | `3001` | Port server |
| `WEBSOCKET_HUB_URL` | `http://localhost:3000` | URL WebSocket Hub |

## Menjalankan

```bash
# development (watch mode)
npm run start:dev

# production
npm run build
npm run start:prod
```

## Alur Kerja

1. Producer menerima request di `POST /trigger/order-paid`
2. Producer mengirim HTTP POST ke Hub endpoint `POST /internal/events/emit`
3. Hub mem-broadcast event `order:status_updated` ke room `user:{userId}`

## Tech Stack

- **NestJS 11** — Framework
- **Axios** — HTTP client untuk komunikasi ke Hub
