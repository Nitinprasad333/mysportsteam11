import { GamesService } from './games.service';
import { CreateGameDto } from '../common/dto/gameDto/create-game.dto';
import { ApiResponse } from 'src/common/interface/response.interface';
import { Game } from './entities/game';
export declare class GamesController {
    private readonly gamesService;
    private readonly logger;
    constructor(gamesService: GamesService);
    create(createGameDto: CreateGameDto, req: any): Promise<ApiResponse<Game>>;
    findAll(page: number | undefined, limit: number | undefined, sortBy: string | undefined, sortOrder: "asc" | "desc" | undefined, search: string, req: any): Promise<ApiResponse<{
        items: Game[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>>;
    remove(id: string): Promise<ApiResponse<null>>;
}
