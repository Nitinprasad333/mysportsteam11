import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game';
import { CreateGameDto } from '../common/dto/gameDto/create-game.dto';


@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game)
    private gamesRepository: Repository<Game>,

  ) {}

 

  async create(createGameDto: CreateGameDto): Promise<Game> {

    const existingGame = await this.gamesRepository.findOne({ where: { name: createGameDto.name } });
    if (existingGame) {
      throw new BadRequestException('Game already exists');
    }
    const game = await this.gamesRepository.create(createGameDto);
    
    return this.gamesRepository.save(game);
  }



async findAll(
  page: number,
  limit: number,
  sortBy = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc',
    search?: string,
): Promise<{ items: Game[]; total: number }> {
  const queryBuilder = this.gamesRepository.createQueryBuilder('game');

  if (search) {
    queryBuilder.where('LOWER(game.name) LIKE :search', { search: `%${search.toLowerCase()}%` });
  }

  queryBuilder
    .orderBy(`game.${sortBy}`, sortOrder.toUpperCase() as 'ASC' | 'DESC')
    .skip((page - 1) * limit)
    .take(limit);

  const [items, total] = await queryBuilder.getManyAndCount();
  return { items, total };
}

  async remove(id: string): Promise<void> {
    const result = await this.gamesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Game not found`);
    }
  }
}
