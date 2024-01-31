import { Injectable, Param, Query } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class ExpBusService {
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
    @Query('busGrade') busGrade: any,
  ): Promise<string[]> {
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
    let grade;
    switch (busGrade) {
      case '우등':
        grade = 1;
        break;
      case '고속':
        grade = 2;
        break;
      case '심야우등':
        grade = 3;
        break;
      case '심야고속':
        grade = 4;
        break;
      case '일반':
        grade = 5;
        break;
      case '일반심야':
        grade = 6;
        break;
      case '프리미엄':
        grade = 7;
        break;
      case '심야프리미엄':
        grade = 8;
        break;
      default:
        grade = 0;
        break;
    }
    /*환승하는 경우 코드 추가 예정*/

    try {
      if (grade === 0) {
        /*let resArr: string[] = [];
        for (let i = 1; i <= 8; i++) {
          const getBusRoute = await firstValueFrom(
            this.httpService.get(
              `${this.configService.get<string>('API_URL')}/ExpBusInfoService/getStrtpntAlocFndExpbusInfo?serviceKey=${this.configService.get<string>('API_KEY')}&_type=json&depTerminalId=NAEK${depTmnCode}&arrTerminalId=NAEK${arrTmnCode}&depPlandTime=${date === 'today' ? today : date}&busGradeId=${i}`,
            ),
          );
          const route = getBusRoute.data.response.body.items.item;
          if (route != null) resArr = [...resArr, ...route];
        }*/
        const getBusRoute = await firstValueFrom(
          this.httpService.get(
            `${this.configService.get<string>('API_URL')}/ExpBusInfoService/getStrtpntAlocFndExpbusInfo?serviceKey=${this.configService.get<string>('API_KEY')}&_type=json&depTerminalId=NAEK${depTmnCode}&arrTerminalId=NAEK${arrTmnCode}&depPlandTime=${date === 'today' ? today : date}`,
          ),
        );
        const routeRes = getBusRoute.data.response.body.items.item;
        return routeRes;
      } else {
        const getBusRoute = await firstValueFrom(
          this.httpService.get(
            `${this.configService.get<string>('API_URL')}/ExpBusInfoService/getStrtpntAlocFndExpbusInfo?serviceKey=${this.configService.get<string>('API_KEY')}&_type=json&depTerminalId=NAEK${depTmnCode}&arrTerminalId=NAEK${arrTmnCode}&depPlandTime=${date === 'today' ? today : date}&busGradeId=${grade}`,
          ),
        );
        const routeRes = getBusRoute.data.response.body.items.item;
        return routeRes;
      }
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}
