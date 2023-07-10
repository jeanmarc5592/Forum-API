import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Exclude } from 'class-transformer';
import { Roles } from 'src/auth/auth.types';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Unique(['name'])
  name: string;

  @Column()
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
