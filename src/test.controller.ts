import { Controller, Get, Param, Body } from '@nestjs/common';
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  getTest(): string {
    return this.testService.getTest();
  }

  @Get('id/:id')
  getParamsId(@Param() params: any): string {
    return this.testService.getParam(params);
  }

  @Get('name/:name')
  getParamsName(@Param() params: any): string {
    return this.testService.getParam(params);
  }
}
