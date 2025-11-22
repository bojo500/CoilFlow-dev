import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoilsController } from './coils.controller';
import { CoilsService } from './coils.service';
import { Coil } from './coil.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coil])],
  controllers: [CoilsController],
  providers: [CoilsService],
  exports: [CoilsService],
})
export class CoilsModule {}
