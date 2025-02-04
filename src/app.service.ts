import { Injectable, HttpStatus } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Welcome to Personal AI Agent API!';
  }

  async getHealth() {
    const healthStatus = {
      app: {
        enabled: true,
        // message: ['We are doing maintenance!', 'Try again later'],
        message: ['API is up and running'],
      },
      api: {},
      services: {},
    };

    return {
      data: healthStatus,
    };
  }
}
