import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('sections_meta')
export class SectionsMeta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  section_no: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'int', nullable: true })
  position_x: number;

  @Column({ type: 'int', nullable: true })
  position_y: number;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
