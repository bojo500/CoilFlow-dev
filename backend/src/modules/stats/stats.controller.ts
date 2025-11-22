import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('api')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('dashboard/today')
  getDashboardToday() {
    return this.statsService.getDashboardToday();
  }

  @Get('stats/summary')
  getSummary(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('groupBy') groupBy: 'week' | 'month' | 'year',
  ) {
    return this.statsService.getSummary(from, to, groupBy);
  }
}
