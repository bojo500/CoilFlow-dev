import { Module, OnModuleInit } from '@nestjs/common';
import { DbModule } from './common/db.module';
import { LoadsModule } from './modules/loads/loads.module';
import { CoilsModule } from './modules/coils/coils.module';
import { LocationsModule } from './modules/locations/locations.module';
import { StatsModule } from './modules/stats/stats.module';
import { LocationsService } from './modules/locations/locations.service';

@Module({
  imports: [DbModule, LoadsModule, CoilsModule, LocationsModule, StatsModule],
})
export class AppModule implements OnModuleInit {
  constructor(private locationsService: LocationsService) {}

  async onModuleInit() {
    // Initialize sections metadata on startup
    await this.locationsService.initializeSectionsMeta();
  }
}
