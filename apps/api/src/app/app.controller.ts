import { Controller, Get, HttpCode, Post } from '@nestjs/common';
import { Message } from '@real-world-app/api-interfaces';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getData(): Message {
    return this.appService.getData();
  }

  @Post('uploadFile')
  @HttpCode(200)
  uploadFile() {
    return of([]).pipe(delay(2000));
  }
}
