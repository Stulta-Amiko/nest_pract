import { Module } from '@nestjs/common';
import { ExpBusController } from './expBus.controller';
import { ExpBusService } from './expBus.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  controllers: [ExpBusController],
  providers: [ExpBusService],
})
export class ExpBusModule {}
