import { Controller, Get, Param, Body } from '@nestjs/common';
import { TestService } from './test.service';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get()
  getTest(@Param() params: any): string {
    console.log();
    return this.testService.getTest();
  }

  @Get('id/:id')
  getParamsId(@Param() params: any): string {
    return this.testService.getParam(params);
  }

  @Get('bus/:name')
  getBustest(@Param() params: any): Promise<string | string[]> {
    return this.testService.getTerminalByName(params);
  }

  @Get('bus/dest/:name')
  getDestTest(@Param() params: any): Promise<string[]> {
    return this.testService.getDestinationByTerminal(params);
  }
}
