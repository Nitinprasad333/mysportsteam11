// src/user/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user/user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

async create(userData: {
  name: string;
  email: string;
  dob: string;
  mobile: string;
}): Promise<User> {
  const user = this.userRepository.create(userData);
  return this.userRepository.save(user);
}

async update(id: number, updateData: Partial<User>): Promise<User> {
  await this.userRepository.update(id, updateData);
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) {
    throw new Error(`User with id ${id} not found`);
  }
  return user;
}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async updateRefreshToken(id: number, token: string) {
  const hashedToken = await bcrypt.hash(token, 10);
  return this.update(id, { refreshToken: hashedToken });
}

async removeRefreshToken(id: number) {
  return this.update(id, { refreshToken: '' });
}


}
