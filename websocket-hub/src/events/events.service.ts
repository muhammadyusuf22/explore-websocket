import { Injectable, Logger } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EmitEventDto } from './dto/emit-event.dto';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(private readonly eventsGateway: EventsGateway) {}

  async emit(data: EmitEventDto) {
    const { userId, event, payload } = data;

    if (userId) {
      this.logger.log(`Emitting event "${event}" to user ${userId}`);
      this.eventsGateway.server.to(`user:${userId}`).emit(event, payload);
    } else {
      this.logger.log(`Broadcasting event "${event}" to all clients`);
      this.eventsGateway.server.emit(event, payload);
    }

    return { 
      success: true, 
      timestamp: new Date().toISOString(),
      target: userId ? `user:${userId}` : 'all' 
    };
  }
}
