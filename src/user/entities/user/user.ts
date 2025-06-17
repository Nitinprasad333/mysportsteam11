// src/user/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column()
  mobile: string;

    @Column({ nullable: true })
  otp?: string ;

  @Column({ type: 'timestamp', nullable: true })
  otpExpiresAt?: Date ;
}
