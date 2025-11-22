import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { Location } from './location.entity';
import { SectionsMeta } from './sections-meta.entity';
import { Coil } from '../coils/coil.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location, SectionsMeta, Coil])],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}
