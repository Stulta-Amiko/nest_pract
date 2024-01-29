import { Controller, Get, Param, Body, Query } from '@nestjs/common';
import { ExpBusService } from './expBus.service';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Controller('test')
export class ExpBusController {
  constructor(private readonly expBusService: ExpBusService) {}

  @Get()
  getTest(@Param() params: any): string {
    console.log();
    return this.expBusService.getTest();
  }

  @Get('id/:id')
  getParamsId(@Param() params: any): string {
    return this.expBusService.getParam(params);
  }

  @Get('bus/:name')
  getBustest(@Param() params: any): Promise<string | string[]> {
    return this.expBusService.getTerminalByName(params);
  }

  @Get('bus/dest/:name')
  getDestTest(@Param() params: any): Promise<string[]> {
    return this.expBusService.getDestinationByTerminal(params);
  }
  @Get('bus/info/route')
  getRouteTest(
    @Query('depTmn') depTmn: any,
    @Query('arrTmn') arrTmn: any,
    @Query('date') date: any,
    @Query('busGrade') busGrade: any,
  ): Promise<string[]> {
    return this.expBusService.getBusInformationDepArr(
      depTmn,
      arrTmn,
      date,
      busGrade,
    );
  }
}
