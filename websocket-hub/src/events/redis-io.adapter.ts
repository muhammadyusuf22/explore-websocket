import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { Redis } from 'ioredis';
import { Logger } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private readonly logger = new Logger(RedisIoAdapter.name);

  async connectToRedis(): Promise<void> {
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD || undefined,
    };

    const pubClient = new Redis(redisConfig);
    const subClient = new Redis(redisConfig);

    pubClient.on('error', (err) => {
      this.logger.error(`Redis PubClient Error: ${err.message}`);
    });

    subClient.on('error', (err) => {
      this.logger.error(`Redis SubClient Error: ${err.message}`);
    });

    await new Promise((resolve, reject) => {
      pubClient.on('ready', () => {
        this.logger.log('Redis clients are ready');
        resolve(true);
      });
      pubClient.on('error', (err) => {
        reject(err);
      });
    });

    this.adapterConstructor = createAdapter(pubClient, subClient);
    this.logger.log('Redis adapter initialized');
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
