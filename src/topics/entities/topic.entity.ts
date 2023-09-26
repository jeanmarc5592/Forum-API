import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { SubCategory } from '@categories/sub-categories/entities/sub-category.entity';
import { Comment } from '@comments/entities/comment.entity';
import { User } from '@users/entities/user.entity';

@Entity()
export class Topic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => SubCategory, (subCategory) => subCategory.topics)
  subCategory: SubCategory;

  @ManyToOne(() => User, (user) => user.topics)
  user: User;

  @Column({ default: false })
  closed: boolean;

  @OneToMany(() => Comment, (comment) => comment.topic)
  comments: Comment[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
