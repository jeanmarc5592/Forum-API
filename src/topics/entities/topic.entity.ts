import { Exclude } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SubCategory } from 'src/categories/sub-categories/entities/sub-category.entity';
import { User } from 'src/users/entities/user.entity';

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

  @Column()
  closed: boolean;

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
