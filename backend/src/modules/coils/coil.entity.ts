import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Load } from '../loads/load.entity';
import { CoilStatus } from '../../common/enums';

@Entity('coils')
export class Coil {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  coil_id: string;

  @Column({ type: 'int', nullable: false })
  width: number;

  @Column({ type: 'int', nullable: false })
  weight: number;

  @Column({
    type: 'enum',
    enum: CoilStatus,
    default: CoilStatus.WIP,
  })
  status: CoilStatus;

  @Column({ type: 'varchar', length: 20, nullable: true })
  location: string;

  @Column({ type: 'int', nullable: true })
  section: number;

  @Column({ type: 'int', nullable: true })
  column: number;

  @Column({ type: 'int', nullable: true })
  row: number;

  @Column({ type: 'date', nullable: true })
  scheduled_for_date: string;

  @Column({ type: 'uuid', nullable: true })
  load_id: string | null;

  @ManyToOne(() => Load, (load) => load.coils)
  @JoinColumn({ name: 'load_id' })
  load: Load;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;
}
