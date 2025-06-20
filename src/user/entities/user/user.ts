import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  dob: string;

  @Column({ unique: true })
  mobile: string;

  @Column({ nullable: true })
  @Exclude()
  otp?: string;

  @Column({ type: 'timestamp', nullable: true })
  @Exclude()
  otpExpiresAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @Exclude()
  refreshToken?: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ nullable: true, type: 'text' })
  bio?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  state?: string;

  @Column({ nullable: true, type: 'text' })
  address?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
