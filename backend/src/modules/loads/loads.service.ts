import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Load } from './load.entity';
import { Coil } from '../coils/coil.entity';
import { CreateLoadDto } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
import { LoadStatus, CoilStatus } from '../../common/enums';

@Injectable()
export class LoadsService {
  constructor(
    @InjectRepository(Load)
    private loadRepository: Repository<Load>,
    @InjectRepository(Coil)
    private coilRepository: Repository<Coil>,
  ) {}

  async create(createLoadDto: CreateLoadDto): Promise<Load> {
    const load = this.loadRepository.create({
      load_number: createLoadDto.load_number,
      customer_name: createLoadDto.customer_name,
      scheduled_time: createLoadDto.scheduled_time,
      created_for_date: createLoadDto.created_for_date,
    });

    const savedLoad = await this.loadRepository.save(load);

    // Assign coils if provided
    if (createLoadDto.coil_ids && createLoadDto.coil_ids.length > 0) {
      await this.assignCoils(savedLoad.id, createLoadDto.coil_ids);
    }

    return this.findOne(savedLoad.id);
  }

  async findAll(date?: string): Promise<Load[]> {
    const whereConditions: any = {};
    if (date) {
      whereConditions.created_for_date = date;
    }

    return this.loadRepository.find({
      where: whereConditions,
      relations: ['coils'],
      order: { scheduled_time: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Load> {
    const load = await this.loadRepository.findOne({
      where: { id },
      relations: ['coils'],
    });

    if (!load) {
      throw new NotFoundException(`Load with ID ${id} not found`);
    }

    // Calculate status dynamically
    load.status = this.calculateLoadStatus(load);

    return load;
  }

  async findToday(): Promise<Load[]> {
    const today = new Date().toISOString().split('T')[0];
    return this.findAll(today);
  }

  async findTomorrow(): Promise<Load[]> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];
    return this.findAll(tomorrowDate);
  }

  async update(id: string, updateLoadDto: UpdateLoadDto): Promise<Load> {
    const load = await this.findOne(id);

    if (updateLoadDto.coil_ids) {
      // Update coil assignments
      await this.updateCoilAssignments(id, updateLoadDto.coil_ids);
    }

    Object.assign(load, updateLoadDto);

    // Calculate status if not explicitly set
    if (!updateLoadDto.status) {
      load.status = this.calculateLoadStatus(load);
    }

    // Set shipped_at if status changed to shipped
    if (updateLoadDto.status === LoadStatus.SHIPPED && !load.shipped_at) {
      load.shipped_at = new Date();
    }

    return this.loadRepository.save(load);
  }

  async assignCoil(loadId: string, coilId: string): Promise<Load> {
    const load = await this.findOne(loadId);
    const coil = await this.coilRepository.findOne({ where: { coil_id: coilId } });

    if (!coil) {
      throw new NotFoundException(`Coil with coil_id ${coilId} not found`);
    }

    if (coil.status === CoilStatus.SCRAP) {
      throw new BadRequestException('Cannot assign scrap coil to load');
    }

    coil.load_id = loadId;
    await this.coilRepository.save(coil);

    return this.findOne(loadId);
  }

  async unassignCoil(loadId: string, coilId: string): Promise<Load> {
    const coil = await this.coilRepository.findOne({ where: { coil_id: coilId } });

    if (!coil) {
      throw new NotFoundException(`Coil with coil_id ${coilId} not found`);
    }

    coil.load_id = null;
    await this.coilRepository.save(coil);

    return this.findOne(loadId);
  }

  async remove(id: string): Promise<void> {
    // Unassign all coils first
    await this.coilRepository.update({ load_id: id }, { load_id: null as any });

    const result = await this.loadRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Load with ID ${id} not found`);
    }
  }

  private async assignCoils(loadId: string, coilIds: string[]): Promise<void> {
    for (const coilId of coilIds) {
      const coil = await this.coilRepository.findOne({ where: { coil_id: coilId } });
      if (coil && coil.status !== CoilStatus.SCRAP) {
        coil.load_id = loadId;
        await this.coilRepository.save(coil);
      }
    }
  }

  private async updateCoilAssignments(loadId: string, coilIds: string[]): Promise<void> {
    // Unassign all current coils
    await this.coilRepository.update({ load_id: loadId }, { load_id: null as any });

    // Assign new coils
    await this.assignCoils(loadId, coilIds);
  }

  /**
   * Calculate load status based on business rules:
   * - READY: All assigned coils are RTS AND in Section 3
   * - MISSING: Any coil is not RTS or not in Section 3
   * - SHIPPED: Manually set when shipped
   */
  private calculateLoadStatus(load: Load): LoadStatus {
    if (load.status === LoadStatus.SHIPPED) {
      return LoadStatus.SHIPPED;
    }

    if (!load.coils || load.coils.length === 0) {
      return LoadStatus.MISSING;
    }

    const allReady = load.coils.every(
      (coil) => coil.status === CoilStatus.RTS && coil.section === 3,
    );

    return allReady ? LoadStatus.READY : LoadStatus.MISSING;
  }
}
