import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coil } from './coil.entity';
import { CreateCoilDto } from './dto/create-coil.dto';
import { UpdateCoilDto } from './dto/update-coil.dto';
import { LocationParser } from '../../common/location-parser';
import { CoilStatus } from '../../common/enums';

@Injectable()
export class CoilsService {
  constructor(
    @InjectRepository(Coil)
    private coilRepository: Repository<Coil>,
  ) {}

  async create(createCoilDto: CreateCoilDto): Promise<Coil> {
    // Validate width and weight
    if (createCoilDto.width <= 0) {
      throw new BadRequestException('Width must be greater than 0');
    }
    if (createCoilDto.weight <= 0) {
      throw new BadRequestException('Weight must be greater than 0');
    }

    const coil = this.coilRepository.create(createCoilDto);

    // Parse location if provided
    if (createCoilDto.location) {
      const parsed = LocationParser.parseAndValidate(createCoilDto.location);
      if (parsed) {
        coil.section = parsed.section;
        coil.column = parsed.column;
        coil.row = parsed.row;
      }
    }

    return this.coilRepository.save(coil);
  }

  async findAll(query?: any): Promise<Coil[]> {
    const whereConditions: any = {};

    if (query?.status) {
      whereConditions.status = query.status;
    }
    if (query?.location) {
      whereConditions.location = query.location;
    }
    if (query?.scheduled_for_date) {
      whereConditions.scheduled_for_date = query.scheduled_for_date;
    }
    if (query?.load_id) {
      whereConditions.load_id = query.load_id;
    }
    if (query?.coil_id) {
      whereConditions.coil_id = query.coil_id;
    }

    return this.coilRepository.find({
      where: whereConditions,
      relations: ['load'],
    });
  }

  async findOne(id: string): Promise<Coil> {
    const coil = await this.coilRepository.findOne({
      where: { id },
      relations: ['load'],
    });

    if (!coil) {
      throw new NotFoundException(`Coil with ID ${id} not found`);
    }

    return coil;
  }

  async findByCoilId(coilId: string): Promise<Coil> {
    const coil = await this.coilRepository.findOne({
      where: { coil_id: coilId },
      relations: ['load'],
    });

    if (!coil) {
      throw new NotFoundException(`Coil with coil_id ${coilId} not found`);
    }

    return coil;
  }

  async findUnassigned(date: string): Promise<Coil[]> {
    return this.coilRepository.find({
      where: {
        scheduled_for_date: date,
        load_id: null as any,
      },
    });
  }

  async update(id: string, updateCoilDto: UpdateCoilDto): Promise<Coil> {
    const coil = await this.findOne(id);

    // Validate if provided
    if (updateCoilDto.width !== undefined && updateCoilDto.width <= 0) {
      throw new BadRequestException('Width must be greater than 0');
    }
    if (updateCoilDto.weight !== undefined && updateCoilDto.weight <= 0) {
      throw new BadRequestException('Weight must be greater than 0');
    }

    // Parse location if updated
    if (updateCoilDto.location) {
      const parsed = LocationParser.parseAndValidate(updateCoilDto.location);
      if (parsed) {
        coil.section = parsed.section;
        coil.column = parsed.column;
        coil.row = parsed.row;
      }
    }

    Object.assign(coil, updateCoilDto);
    return this.coilRepository.save(coil);
  }

  async remove(id: string): Promise<void> {
    const result = await this.coilRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Coil with ID ${id} not found`);
    }
  }
}
