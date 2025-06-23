import { Repository } from 'typeorm';
import { Game } from './entities/game';
import { CreateGameDto } from '../common/dto/gameDto/create-game.dto';
export declare class GamesService {
    private gamesRepository;
    constructor(gamesRepository: Repository<Game>);
    create(createGameDto: CreateGameDto): Promise<Game>;
    findAll(page: number, limit: number, sortBy?: string, sortOrder?: 'asc' | 'desc', search?: string): Promise<{
        items: Game[];
        total: number;
    }>;
    remove(id: string): Promise<void>;
}
