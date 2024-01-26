import { Injectable, Param, Query } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class TestService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  getTest(): string {
    return 'Test return';
  }

  getParam(@Param() params: any): string {
    return `Test Params Return ${params.id ? params.id : params.name}`;
  }

  async getTerminalByName(@Param() params: any): Promise<string | string[]> {
    try {
      const apiRes = await firstValueFrom(
        this.httpService.get(
          `${this.configService.get<string>('API_URL')}/ExpBusArrInfoService/getExpBusTmnList?serviceKey=${this.configService.get<string>('API_KEY')}&_type=json&tmnNm=${params.name}`,
        ),
      );
      const resItem = apiRes.data.response.body.items;
      if (Array.isArray(resItem)) {
        return resItem;
      } else {
        return resItem.item;
      }
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async getDestinationByTerminal(@Param() params: any): Promise<string[]> {
    let tmnCode: string;
    try {
      const getTmnNameRes = await firstValueFrom(
        this.httpService.get(
          `${this.configService.get<string>('API_URL')}/ExpBusArrInfoService/getExpBusTmnList?serviceKey=${this.configService.get<string>('API_KEY')}&_type=json&tmnNm=${params.name}`,
        ),
      );

      const getTmnCode = (res: any): string => {
        if (Array.isArray(res)) {
          const code = res.find((item) => item.tmnNm === params.name);
          return code.tmnCd.toString();
        } else {
          return res.tmnCd;
        }
      };

      const nameRes = getTmnNameRes.data.response.body.items.item;
      tmnCode = getTmnCode(nameRes);
      console.log(tmnCode);
    } catch (e) {
      console.log(`name based Terminal code 조회시 오류발생`);
      return e;
    }

    try {
      const getDestRes = await firstValueFrom(
        this.httpService.get(
          `${this.configService.get<string>('API_URL')}/ExpBusArrInfoService/getArrTmnFromDepTmn?serviceKey=${this.configService.get<string>('API_KEY')}&numOfRows=100&_type=json&depTmnCd=${tmnCode}`,
        ),
      );
      return getDestRes.data.response.body.items.item;
    } catch (e) {
      console.log();
      return e;
    }
  }

  async getBusInformationDepArr(
    @Query('depTmn') depTmn: any,
    @Query('arrTmn') arrTmn: any,
    @Query('date') date: any,
  ): Promise<string> {
    let depTmnCode: string;
    let arrTmnCode: string;
    try {
      const getTmnCode = async (terminal: string) => {
        const getCodeRes = await firstValueFrom(
          this.httpService.get(
            `${this.configService.get<string>('API_URL')}/ExpBusArrInfoService/getExpBusTmnList?serviceKey=${this.configService.get<string>('API_KEY')}&_type=json&tmnNm=${terminal}`,
          ),
        );

        const findTmnCode = (res: any): string => {
          if (Array.isArray(res)) {
            const code = res.find((item) => item.tmnNm === terminal);
            return code.tmnCd.toString();
          } else {
            return res.tmnCd;
          }
        };

        const depNameRes = getCodeRes.data.response.body.items.item;
        const TmnCd = findTmnCode(depNameRes);
        return TmnCd;
      };

      depTmnCode = await getTmnCode(depTmn);
      arrTmnCode = await getTmnCode(arrTmn);
    } catch (e) {
      console.log(`name based Terminal code 조회시 오류발생`);
      return e;
    }
    const now = new Date();
    const today = `${now.getFullYear()}${now.getMonth() < 10 ? '0' : ''}${now.getMonth() + 1}${now.getDate()}`;

    const getBusRoute = await firstValueFrom(
      this.httpService.get(
        `${this.configService.get<string>('API_URL')}/ExpBusInfoService/getStrtpntAlocFndExpbusInfo?serviceKey=${this.configService.get<string>('API_KEY')}&_type=json&depTerminalId=NAEK${depTmnCode}&arrTerminalId=NAEK${arrTmnCode}&depPlandTime=${date === 'today' ? today : date}&busGradeId=1`,
      ),
    );

    const routeRes = getBusRoute.data.response.body.items.item;
    return routeRes;
  }
}
