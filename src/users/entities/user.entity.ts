import { Exclude } from 'class-transformer';
import { Factory } from 'nestjs-seeder';
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

import { Comment } from '@/comments/entities/comment.entity';
import { Roles } from '@auth/auth.types';
import { SubCategory } from '@categories/sub-categories/entities/sub-category.entity';
import { Topic } from '@topics/entities/topic.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Factory('Admin')
  @Column({ nullable: true })
  @Unique(['name'])
  name: string;

  @Factory((faker) => faker?.number.int({ min: 16, max: 90 }))
  @Column({ nullable: true })
  age: string;

  @Factory('admin@forum.com')
  @Column()
  @Unique(['email'])
  @Exclude()
  email: string;

  @Factory('password')
  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @Factory(Roles.ADMIN)
  @Column({ type: 'enum', enum: Roles, default: Roles.USER })
  role: Roles;

  @OneToMany(() => Topic, (topic) => topic.user)
  topics: Topic[];

  @ManyToMany(() => SubCategory, (subCategory) => subCategory.moderators)
  subCategories: SubCategory[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

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
