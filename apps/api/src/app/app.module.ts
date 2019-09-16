import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { InMemoryDBService } from './test.service';
@Module({
  controllers: [AppController],
  providers: [InMemoryDBService]
})
export class AppModule {}
