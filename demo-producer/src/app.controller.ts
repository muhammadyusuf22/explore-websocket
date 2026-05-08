import { Controller, Post, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Controller('trigger')
export class AppController {
  constructor(private configService: ConfigService) {}

  @Post('order-paid')
  async triggerOrderPaid(@Body() body: { userId: string; orderId: string }) {
    const hubUrl = this.configService.get<string>(
      'WEBSOCKET_HUB_URL',
      'http://localhost:3000',
    );

    const payload = {
      userId: body.userId,
      event: 'order:status_updated',
      payload: {
        orderId: body.orderId,
        status: 'PAID',
        message: `Notification from Demo Producer: Order ${body.orderId} is paid!`,
        timestamp: new Date().toISOString(),
      },
    };

    try {
      const response = await axios.post(
        `${hubUrl}/internal/events/emit`,
        payload,
      );
      return { success: true, hubResponse: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
