import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { LocationType } from '../../common/enums';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  section: number;

  @Column({ type: 'int', nullable: false })
  column: number;

  @Column({ type: 'int', nullable: false })
  row: number;

  @Column({
    type: 'enum',
    enum: LocationType,
    default: LocationType.STORAGE,
  })
  type: LocationType;

  @Column({ type: 'text', nullable: true })
  description: string;
}
