import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Load } from '../loads/load.entity';
import { Coil } from '../coils/coil.entity';
import { LoadStatus, CoilStatus } from '../../common/enums';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Load)
    private loadRepository: Repository<Load>,
    @InjectRepository(Coil)
    private coilRepository: Repository<Coil>,
  ) {}

  async getDashboardToday(): Promise<any> {
    const today = new Date().toISOString().split('T')[0];

    const loads = await this.loadRepository.find({
      where: { created_for_date: today },
      relations: ['coils'],
      order: { scheduled_time: 'ASC' },
    });

    const loadCards = loads.map((load) => {
      const totalCoils = load.coils.length;
      const readyCoils = load.coils.filter((c) => c.status === CoilStatus.RTS).length;
      const allInSection3 = load.coils.every((c) => c.section === 3);
      const allRTS = load.coils.every((c) => c.status === CoilStatus.RTS);

      let statusDot: 'green' | 'red' | 'grey';
      if (load.status === LoadStatus.SHIPPED) {
        statusDot = 'grey';
      } else if (allRTS && allInSection3) {
        statusDot = 'green';
      } else {
        statusDot = 'red';
      }

      return {
        id: load.id,
        last4: load.load_number.toString().slice(-4),
        full_load_number: load.load_number,
        customer_name: load.customer_name,
        scheduled_time: load.scheduled_time,
        total_coils: totalCoils,
        ready_coils: readyCoils,
        readyFraction: totalCoils > 0 ? `${readyCoils}/${totalCoils}` : '0/0',
        statusDot,
        status: load.status,
        isShipped: load.status === LoadStatus.SHIPPED,
      };
    });

    const totalLoads = loads.length;
    const readyLoads = loads.filter((l) =>
      l.coils.every((c) => c.status === CoilStatus.RTS && c.section === 3),
    ).length;
    const missingLoads = loads.filter(
      (l) => l.status !== LoadStatus.SHIPPED && !l.coils.every((c) => c.status === CoilStatus.RTS && c.section === 3),
    ).length;

    return {
      loads: loadCards,
      quick_counts: {
        totalLoads,
        readyLoads,
        missingLoads,
      },
    };
  }

  async getSummary(from: string, to: string, groupBy: 'week' | 'month' | 'year'): Promise<any> {
    const loads = await this.loadRepository.find({
      where: {
        created_for_date: Between(from, to),
      },
      relations: ['coils'],
    });

    const coils = await this.coilRepository.find({
      where: {
        created_at: Between(new Date(from), new Date(to)),
      },
    });

    const totalCoils = coils.length;
    const shippedLoads = loads.filter((l) => l.status === LoadStatus.SHIPPED).length;
    const scrapCoils = coils.filter((c) => c.status === CoilStatus.SCRAP).length;

    // Group by period (simplified - could be enhanced with proper date grouping)
    const periods: any[] = [];

    if (groupBy === 'week') {
      // Group by weeks
      const weeks = this.groupByWeek(loads, coils);
      periods.push(...weeks);
    } else if (groupBy === 'month') {
      // Group by months
      const months = this.groupByMonth(loads, coils);
      periods.push(...months);
    } else {
      // Group by year
      const years = this.groupByYear(loads, coils);
      periods.push(...years);
    }

    return {
      summary: {
        total_coils: totalCoils,
        trucks_shipped: shippedLoads,
        scrap_coils: scrapCoils,
        from,
        to,
        groupBy,
      },
      periods,
    };
  }

  private groupByWeek(loads: Load[], coils: Coil[]): any[] {
    // Simplified: return aggregate
    return [
      {
        period: 'All',
        loads: loads.length,
        coils: coils.length,
        scrap: coils.filter((c) => c.status === CoilStatus.SCRAP).length,
      },
    ];
  }

  private groupByMonth(loads: Load[], coils: Coil[]): any[] {
    return [
      {
        period: 'All',
        loads: loads.length,
        coils: coils.length,
        scrap: coils.filter((c) => c.status === CoilStatus.SCRAP).length,
      },
    ];
  }

  private groupByYear(loads: Load[], coils: Coil[]): any[] {
    return [
      {
        period: 'All',
        loads: loads.length,
        coils: coils.length,
        scrap: coils.filter((c) => c.status === CoilStatus.SCRAP).length,
      },
    ];
  }
}
