import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoadsController } from './loads.controller';
import { LoadsService } from './loads.service';
import { Load } from './load.entity';
import { Coil } from '../coils/coil.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Load, Coil])],
  controllers: [LoadsController],
  providers: [LoadsService],
  exports: [LoadsService],
})
export class LoadsModule {}
