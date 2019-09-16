import {} from '@nestjs-addons/in-memory-db';
import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { UploadFileInputModel } from '@real-world-app/api-interfaces';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { InMemoryDBService } from './test.service';

@Controller()
export class AppController {
  constructor(
    private readonly inMemoryDBService: InMemoryDBService<UploadFileInputModel>
  ) {}

  @Post('uploadFile')
  @HttpCode(200)
  uploadFile(@Body() model) {
    //console.log({ model });
    return this.inMemoryDBService
      .createAsync(model)
      .pipe(map(created => created.id));
  }

  @Get('downloadFile/:id')
  downloadFile(@Param('id') id: string) {
    console.log({ id });
    // const all = this.inMemoryDBService.recordMap['1'];
    // console.log({ all });
    return this.inMemoryDBService.getAsync(+id).pipe(
      map(file => file.fileContent),
      catchError(error => {
        console.error(error);
        return of(error);
      })
    );
  }
}
