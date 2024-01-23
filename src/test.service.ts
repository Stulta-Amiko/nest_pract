import { Injectable, Param } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable, catchError, firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { tap } from 'rxjs';
import { response } from 'express';
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

  getTerminalByName(@Param() params: any): string {
    this.httpService
      .get(
        `${this.configService.get<string>('API_URL')}/getExpBusTmnList?serviceKey=${this.configService.get<string>('API_KEY')}&_type=json&tmnNm=${params.name}`,
      )
      .subscribe((response) => {
        const item = response.data.response.body.items.item;
        console.log(item);
        console.log(
          Array.isArray(item)
            ? item.map((item) =>
                item.tmnNm == params.name ? params.name : false,
              )
            : false,
        );
        console.log(
          Array.isArray(item) ? item.map((item) => item.tmnNm) : item.tmnNm,
        );
      });
    return `return test`;
  }

  async getDestinationByTerminal(@Param() params: any): Promise<string> {
    const apiRes = await firstValueFrom(
      this.httpService.get(
        `${this.configService.get<string>('API_URL')}/getExpBusTmnList?serviceKey=${this.configService.get<string>('API_KEY')}&_type=json&tmnNm=${params.name}`,
      ),
    );
    const apiResTest = apiRes.data.response.body.items.item;
    let tmnCode;

    Array.isArray(apiResTest)
      ? apiResTest.map((item) =>
          item.tmnNm === params.name
            ? (tmnCode = item.tmnCd)
            : 'server error occurred',
        )
      : (tmnCode = apiResTest.tmnCd);
    console.log(tmnCode);
    try {
      this.httpService
        .get(
          `${this.configService.get<string>('API_URL')}/getArrTmnFromDepTmn?serviceKey=${this.configService.get<string>('API_KEY')}&numOfRows=100&_type=json&depTmnCd=${tmnCode}`,
        )
        .subscribe((res) => {
          const destItem = res.data.response.body.items.item;
          console.log(destItem);
        });
    } catch (e) {
      console.log(e);
      return e;
    }
    return `return test`;
  }
}
