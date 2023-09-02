import { Exclude } from 'class-transformer';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Topic } from '@topics/entities/topic.entity';
import { User } from '@users/entities/user.entity';

import { MainCategory } from '../../main-categories/entities/main-category.entity';

@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(() => MainCategory, (mainCategory) => mainCategory.subCategories)
  mainCategory: MainCategory;

  @OneToMany(() => Topic, (topic) => topic.subCategory)
  topics: Topic[];

  @ManyToMany(() => User, (user) => user.subCategories)
  @JoinTable()
  moderators: User[];

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
