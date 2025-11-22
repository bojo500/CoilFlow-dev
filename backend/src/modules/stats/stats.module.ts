import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { Load } from '../loads/load.entity';
import { Coil } from '../coils/coil.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Load, Coil])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
