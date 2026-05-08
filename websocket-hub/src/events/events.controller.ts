import { Controller, Post, Body } from '@nestjs/common';
import { EventsService } from './events.service';
import { EmitEventDto } from './dto/emit-event.dto';

@Controller('internal/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post('emit')
  async emitEvent(@Body() body: EmitEventDto) {
    return await this.eventsService.emit(body);
  }
}
