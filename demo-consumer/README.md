# Demo Consumer

Contoh service backend yang berperan sebagai **Consumer/Listener** — menerima event real-time dari WebSocket Hub menggunakan `socket.io-client`.

## Deskripsi

Service ini mensimulasikan backend service yang perlu mendengarkan event secara real-time dari Hub. Saat aplikasi start, service otomatis membuka koneksi WebSocket ke Hub dan listen event tertentu.

## Cara Kerja

`WebsocketListenerService` berjalan saat module diinisialisasi (`OnModuleInit`):

1. Membuka koneksi ke WebSocket Hub menggunakan `socket.io-client`
2. Join room `user:user-uuid-123` via query parameter
3. Listen event `order:status_updated` dan log hasilnya

## Setup

```bash
npm install
cp .env.example .env
```

## Environment Variables

| Variable | Default | Deskripsi |
|---|---|---|
| `PORT` | `3002` | Port server |
| `WEBSOCKET_HUB_URL` | `http://localhost:3000` | URL WebSocket Hub |

## Menjalankan

```bash
# development (watch mode)
npm run start:dev

# production
npm run build
npm run start:prod
```

Setelah berjalan, service akan otomatis connect ke Hub. Ketika producer mengirim event, output akan muncul di terminal:

```
[WebsocketListenerService] Connected to WebSocket Hub as Demo Consumer
[WebsocketListenerService] [RECEIVED] Order Update: Notification from Demo Producer: Order ORD-UV-20240507-001 is paid!
```

## Tech Stack

- **NestJS 11** — Framework
- **socket.io-client 4** — WebSocket client untuk koneksi ke Hub
