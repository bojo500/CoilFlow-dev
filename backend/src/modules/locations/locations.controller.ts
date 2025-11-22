import { Controller, Get, Param } from '@nestjs/common';
import { LocationsService } from './locations.service';

@Controller('api/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Get('sections')
  getSections() {
    return this.locationsService.getSections();
  }

  @Get(':section/grid')
  getSectionGrid(@Param('section') section: string) {
    return this.locationsService.getSectionGrid(parseInt(section));
  }
}
