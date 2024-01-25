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
          `${this.configService.get<string>('API_URL')}/getExpBusTmnList?serviceKey=${this.configService.get<string>('API_KEY')}&_type=json&tmnNm=${params.name}`,
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
          `${this.configService.get<string>('API_URL')}/getExpBusTmnList?serviceKey=${this.configService.get<string>('API_KEY')}&_type=json&tmnNm=${params.name}`,
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
          `${this.configService.get<string>('API_URL')}/getArrTmnFromDepTmn?serviceKey=${this.configService.get<string>('API_KEY')}&numOfRows=100&_type=json&depTmnCd=${tmnCode}`,
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
  ): Promise<string> {
    console.log(depTmn, arrTmn);
    let depTmnCode: string;
    let arrTmnCode: string;
    try {
      const getTmnNameRes = await firstValueFrom(
        this.httpService.get(
          `${this.configService.get<string>('API_URL')}/getExpBusTmnList?serviceKey=${this.configService.get<string>('API_KEY')}&_type=json&tmnNm=${depTmn}`,
        ),
      );
      const getTmnNameRes2 = async (terminal: string) => {
        const afds = await firstValueFrom(
          this.httpService.get(
            `${this.configService.get<string>('API_URL')}/getExpBusTmnList?serviceKey=${this.configService.get<string>('API_KEY')}&_type=json&tmnNm=${terminal}`,
          ),
        );
        return afds.data;
      };

      console.log(getTmnNameRes2('서울'));

      const getTmnCode = (res: any): string => {
        if (Array.isArray(res)) {
          const code = res.find((item) => item.tmnNm === depTmn);
          return code.tmnCd.toString();
        } else {
          return res.tmnCd;
        }
      };

      const depNameRes = getTmnNameRes.data.response.body.items.item;
      //const arrNameRes =
      depTmnCode = getTmnCode(depNameRes);
      //console.log(depTmnCode);
      return `asdf`;
    } catch (e) {
      console.log(`name based Terminal code 조회시 오류발생`);
      return e;
    }
    return `asdf`;
  }
}
