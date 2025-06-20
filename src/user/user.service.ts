// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user/user';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from 'src/common/dto/userDto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

async create(userData: {
  email?: string;
  mobile?: string;
}): Promise<User> {
  const user = this.userRepository.create(userData);
  return this.userRepository.save(user);
}

// async update(id: number, updateData: Partial<User>): Promise<User> {
//   await this.userRepository.update(id, updateData);
//   const user = await this.userRepository.findOne({ where: { id } });
//   if (!user) {
//     throw new Error(`User with id ${id} not found`);
//   }
//   return user;
// }


  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByMobile(mobile: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { mobile } });
  }

  async updateRefreshToken(id: number, token: string) {
  const hashedToken = await bcrypt.hash(token, 10);
  return this.update(id, { refreshToken: hashedToken });
}

async removeRefreshToken(id: number) {
  return this.update(id, { refreshToken: '' });
}


async findAll(
  page: number,
  limit: number,
  search?: string,
  sortBy = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
): Promise<{ items: User[]; total: number }> {
  const queryBuilder = this.userRepository.createQueryBuilder('user');

  if (search && search.trim() !== '') {
    queryBuilder.where('LOWER(user.name) LIKE :search', {
      search: `%${search.toLowerCase()}%`,
    });
  }

  queryBuilder
    .orderBy(`user.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
    .skip((page - 1) * limit)
    .take(limit);

  const [items, total] = await queryBuilder.getManyAndCount();
  return { items, total };
}


async remove(id: number): Promise<void> {
  const result = await this.userRepository.delete(id);
  if (result.affected === 0) {
    throw new NotFoundException(`User with id ${id} not found`);
  }
}



async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
  const user = await this.userRepository.findOne({ where: { id: +id } });

  if (!user) {
    throw new NotFoundException(`User with id ${id} not found`);
  }
  

  Object.assign(user, updateUserDto); 

  return await this.userRepository.save(user);
}


}
