import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class WebsocketListenerService implements OnModuleInit {
  private socket: Socket;
  private readonly logger = new Logger(WebsocketListenerService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const hubUrl = this.configService.get<string>('WEBSOCKET_HUB_URL', 'http://localhost:3000');
    
    this.socket = io(hubUrl, {
      auth: { token: 'DEMO_CONSUMER_TOKEN' },
      query: { 
        serviceName: 'demo-consumer',
        userId: 'user-uuid-123' 
      },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      this.logger.log('Connected to WebSocket Hub as Demo Consumer');
    });

    this.socket.on('order:status_updated', (data) => {
      this.logger.log(`[RECEIVED] Order Update: ${data.message}`);
    });

    this.socket.on('connect_error', (err) => {
      this.logger.error(`Connection Error: ${err.message}`);
    });
  }
}
