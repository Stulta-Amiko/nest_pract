import { Injectable, Param } from '@nestjs/common';

@Injectable()
export class TestService {
  getTest(): string {
    return 'Test return';
  }

  getParam(@Param() params: any): string {
    return `Test Params Return ${params.id ? params.id : params.name}`;
  }
}
