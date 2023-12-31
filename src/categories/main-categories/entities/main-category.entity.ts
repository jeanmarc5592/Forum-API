import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { SubCategory } from '../../sub-categories/entities/sub-category.entity';

@Entity()
export class MainCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Unique(['name'])
  name: string;

  @Column()
  description: string;

  @OneToMany(() => SubCategory, (subCategory) => subCategory.mainCategory, {
    cascade: ['remove'],
  })
  subCategories: SubCategory[];

  @CreateDateColumn({ type: 'timestamp' })
  @Exclude()
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Exclude()
  updated_at: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
