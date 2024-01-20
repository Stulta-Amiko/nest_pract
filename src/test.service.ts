import { Injectable, Param } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
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

  getBus(@Param() params: any): string {
    this.httpService
      .get(
        `${this.configService.get<string>('API_URL')}/getExpBusTmnList?serviceKey=${this.configService.get<string>('API_KEY')}&_type=json&tmnNm=${params.name}`,
      )
      .subscribe((response) => {
        const item = response.data.response.body.items.item;
        console.log(
          Array.isArray(item) ? item.map((item) => item.tmnNm) : item.tmnNm,
        );
      });

    this.httpService.get(`http://localhost:3000/test`).subscribe((response) => {
      console.log(response.data);
    });

    return `return test`;
  }
}
