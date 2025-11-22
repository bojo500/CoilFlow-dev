import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './location.entity';
import { SectionsMeta } from './sections-meta.entity';
import { Coil } from '../coils/coil.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private locationRepository: Repository<Location>,
    @InjectRepository(SectionsMeta)
    private sectionsMetaRepository: Repository<SectionsMeta>,
    @InjectRepository(Coil)
    private coilRepository: Repository<Coil>,
  ) {}

  async getSections(): Promise<any> {
    const sections = await this.sectionsMetaRepository.find({
      order: { section_no: 'ASC' },
    });

    return {
      sections: sections.map((s) => ({
        section_no: s.section_no,
        name: s.name,
        position_x: s.position_x,
        position_y: s.position_y,
        notes: s.notes,
      })),
      layout: {
        columns: 4,
        rows: 6,
      },
    };
  }

  async getSectionGrid(section: number): Promise<any> {
    // Get all coils in this section (by section number)
    const coils = await this.coilRepository.find({
      where: { section },
      relations: ['load'],
    });

    // Build grid structure (4 columns × 6 rows)
    const grid: any[] = [];
    for (let row = 1; row <= 6; row++) {
      for (let col = 1; col <= 4; col++) {
        const cellCoils = coils.filter((c) => c.column === col && c.row === row);
        grid.push({
          section,
          column: col,
          row,
          location: `${section}0${col}0${row}`, // e.g., 30104
          coil_count: cellCoils.length,
          coils: cellCoils.map((c) => ({
            coil_id: c.coil_id,
            status: c.status,
            load_id: c.load_id,
          })),
        });
      }
    }

    // Add special location coils for Section 3 (S3, 126, TRUCK)
    if (section === 3) {
      const specialLocations = ['S3', '126', 'TRUCK', 'TRUCK RESERVING AREA'];

      for (const specialLoc of specialLocations) {
        const specialCoils = await this.coilRepository.find({
          where: { location: specialLoc },
          relations: ['load'],
        });

        if (specialCoils.length > 0 || specialLoc === 'S3' || specialLoc === '126' || specialLoc === 'TRUCK') {
          grid.push({
            section,
            column: null,
            row: null,
            location: specialLoc,
            coil_count: specialCoils.length,
            coils: specialCoils.map((c) => ({
              coil_id: c.coil_id,
              status: c.status,
              load_id: c.load_id,
            })),
          });
        }
      }
    }

    return {
      section,
      grid,
    };
  }

  async initializeSectionsMeta(): Promise<void> {
    const existingCount = await this.sectionsMetaRepository.count();
    if (existingCount > 0) {
      return; // Already initialized
    }

    // Default layout positions
    const defaultSections = [
      { section_no: 1, name: 'Section 1', position_x: 0, position_y: 0, notes: 'Top-left' },
      { section_no: 2, name: 'Section 2', position_x: 1, position_y: 0, notes: 'Top-right' },
      { section_no: 3, name: 'Section 3 (Dock)', position_x: 1, position_y: 1, notes: 'Bottom-right - Shipping dock' },
      { section_no: 4, name: 'Section 4', position_x: 0, position_y: 1, notes: 'Bottom-left' },
    ];

    for (const section of defaultSections) {
      const meta = this.sectionsMetaRepository.create(section);
      await this.sectionsMetaRepository.save(meta);
    }
  }
}
