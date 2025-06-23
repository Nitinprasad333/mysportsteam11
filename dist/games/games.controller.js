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
var GamesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GamesController = void 0;
const common_1 = require("@nestjs/common");
const games_service_1 = require("./games.service");
const create_game_dto_1 = require("../common/dto/gameDto/create-game.dto");
const auth_guard_1 = require("@nestjs/passport/dist/auth.guard");
const content_type_interceptor_1 = require("../common/interceptors/content-type.interceptor");
let GamesController = GamesController_1 = class GamesController {
    gamesService;
    logger = new common_1.Logger(GamesController_1.name);
    constructor(gamesService) {
        this.gamesService = gamesService;
    }
    async create(createGameDto, req) {
        try {
            const game = await this.gamesService.create(createGameDto);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Game created successfully',
                data: game,
            };
        }
        catch (error) {
            this.logger.error('Error creating game', error.stack);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Failed to create game',
                error: error.message || 'Unknown error',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search, req) {
        try {
            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            const { items, total } = await this.gamesService.findAll(pageNum, limitNum, sortBy, sortOrder, search);
            const message = items.length === 0 ? 'No record found' : 'Games retrieved successfully';
            return {
                statusCode: common_1.HttpStatus.OK,
                message,
                data: {
                    items,
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum),
                },
            };
        }
        catch (error) {
            this.logger.error('Error retrieving games', error.stack);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to retrieve games',
                error: error.message || 'Unknown error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            await this.gamesService.remove(id);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Game deleted successfully',
                data: null,
            };
        }
        catch (error) {
            this.logger.error(`Error deleting game with id ${id}`, error.stack);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Failed to delete game',
                error: error.message || 'Unknown error',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.GamesController = GamesController;
__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)('jwt')),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_game_dto_1.CreateGameDto, Object]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)('jwt')),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, auth_guard_1.AuthGuard)('jwt')),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GamesController.prototype, "remove", null);
exports.GamesController = GamesController = GamesController_1 = __decorate([
    (0, common_1.UseInterceptors)(content_type_interceptor_1.ContentTypeInterceptor),
    (0, common_1.Controller)('games'),
    __metadata("design:paramtypes", [games_service_1.GamesService])
], GamesController);
//# sourceMappingURL=games.controller.js.map