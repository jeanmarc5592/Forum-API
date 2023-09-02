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
  ManyToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { Roles } from '@auth/auth.types';
import { SubCategory } from '@categories/sub-categories/entities/sub-category.entity';
import { Topic } from '@topics/entities/topic.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  @Unique(['name'])
  name: string;

  @Column({ nullable: true })
  age: string;

  @Column()
  @Unique(['email'])
  @Exclude()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.USER })
  role: Roles;

  @OneToMany(() => Topic, (topic) => topic.user)
  topics: Topic[];

  @ManyToMany(() => SubCategory, (subCategory) => subCategory.moderators)
  subCategories: SubCategory[];

  @CreateDateColumn({ type: 'timestamp' })
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
