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

  /*Create new user service*/
  async create(userData: { email?: string; mobile?: string }): Promise<User> {
    const defaultUserFields: Partial<User> = {
      name: '',
      dob: '',
      profilePicture: '',
      bio: '',
      country: '',
      state: '',
      address: '',
      ...(userData.email ? { email: userData.email } : {}),
      ...(userData.mobile ? { mobile: userData.mobile } : {}),
    };

    const user = this.userRepository.create(defaultUserFields);
    return await this.userRepository.save(user);
  }

  // async update(id: number, updateData: Partial<User>): Promise<User> {
  //   await this.userRepository.update(id, updateData);
  //   const user = await this.userRepository.findOne({ where: { id } });
  //   if (!user) {
  //     throw new Error(`User with id ${id} not found`);
  //   }
  //   return user;
  // }

  /*Find user by ID service*/
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  /*Find user by email service*/
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  /*Find user by mobile service*/
  async findByMobile(mobile: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { mobile } });
  }

  /*Update Refresh token service*/
  async updateRefreshToken(id: number, token: string) {
    const hashedToken = await bcrypt.hash(token, 10);
    return this.update(id, { refreshToken: hashedToken });
  }

  /*Remove Refresh token service*/
  async removeRefreshToken(id: number) {
    return this.update(id, { refreshToken: '' });
  }

  /*Save User service*/
  async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  /*Get All Users with pagination service*/
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

  /*Delete User service*/
  async remove(id: number): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }

  /*Update User service*/
  async update(
    id: number,
    updateUserDto: Partial<UpdateUserDto>,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }
}
