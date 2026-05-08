import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  private readonly logger = new Logger(WsJwtGuard.name);

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client: Socket = context.switchToWs().getClient<Socket>();
      const authToken = client.handshake.headers.authorization?.split(' ')[1] || client.handshake.query.token as string;
      
      if (!authToken) {
        throw new WsException('Unauthorized: No token provided');
      }

      // Bypass untuk testing demo
      if (authToken.startsWith('DEMO_')) {
        this.logger.log(`Using Demo Token: ${authToken}`);
        client.data.user = { id: client.handshake.query.userId || 'demo-user' };
        return true;
      }

      const payload = await this.jwtService.verifyAsync(authToken, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
      });

      // Attach user data to client
      client.data.user = payload;
      
      return true;
    } catch (err) {
      this.logger.error(`WS Authentication failed: ${err.message}`);
      throw new WsException('Unauthorized');
    }
  }
}
