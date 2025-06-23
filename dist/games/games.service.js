"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const game_1 = require("./entities/game");
let GamesService = class GamesService {
    gamesRepository;
    constructor(gamesRepository) {
        this.gamesRepository = gamesRepository;
    }
    async create(createGameDto) {
        const existingGame = await this.gamesRepository.findOne({ where: { name: createGameDto.name } });
        if (existingGame) {
            throw new common_1.BadRequestException('Game already exists');
        }
        const game = await this.gamesRepository.create(createGameDto);
        return this.gamesRepository.save(game);
    }
    async findAll(page, limit, sortBy = 'createdAt', sortOrder = 'desc', search) {
        const queryBuilder = this.gamesRepository.createQueryBuilder('game');
        if (search) {
            queryBuilder.where('LOWER(game.name) LIKE :search', { search: `%${search.toLowerCase()}%` });
        }
        queryBuilder
            .orderBy(`game.${sortBy}`, sortOrder.toUpperCase())
            .skip((page - 1) * limit)
            .take(limit);
        const [items, total] = await queryBuilder.getManyAndCount();
        return { items, total };
    }
    async remove(id) {
        const result = await this.gamesRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Game not found`);
        }
    }
};
exports.GamesService = GamesService;
exports.GamesService = GamesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(game_1.Game)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GamesService);
//# sourceMappingURL=games.service.js.map