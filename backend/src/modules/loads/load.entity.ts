import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Coil } from '../coils/coil.entity';
import { LoadStatus } from '../../common/enums';

@Entity('loads')
export class Load {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', nullable: false })
  load_number: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  customer_name: string;

  @Column({ type: 'time', nullable: true })
  scheduled_time: string;

  @Column({
    type: 'enum',
    enum: LoadStatus,
    default: LoadStatus.MISSING,
  })
  status: LoadStatus;

  @Column({ type: 'date', nullable: false })
  created_for_date: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ nullable: true })
  updated_at: Date;

  @Column({ type: 'datetime', nullable: true })
  shipped_at: Date;

  @OneToMany(() => Coil, (coil) => coil.load)
  coils: Coil[];
}
