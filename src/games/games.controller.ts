import { Controller, Get, Post, Body, HttpStatus, UseGuards, Request, HttpException, Logger,
     Param, Delete, Query,
     UseInterceptors
 } from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from '../common/dto/gameDto/create-game.dto';
import { ApiResponse } from 'src/common/interface/response.interface';
import { Game } from './entities/game';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { ContentTypeInterceptor } from 'src/common/interceptors/content-type.interceptor';
@UseInterceptors(ContentTypeInterceptor)
@Controller('games')
export class GamesController {
  private readonly logger = new Logger(GamesController.name);

  constructor(private readonly gamesService: GamesService) {}

    /*   * Creates a new game */
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createGameDto: CreateGameDto, @Request() req): Promise<ApiResponse<Game>> {
    try {
      const game = await this.gamesService.create(createGameDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Game created successfully',
        data: game,
      };
    } catch (error) {
      this.logger.error('Error creating game', error.stack);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to create game',
          error: error.message || 'Unknown error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }



  /*   * Retrieves all games*/
@Get()
@UseGuards(AuthGuard('jwt'))
async findAll(
  @Query('page') page = 1,
  @Query('limit') limit = 10,
  @Query('sortBy') sortBy = 'createdAt',
  @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Query('search') search: string,
  @Request() req
): Promise<ApiResponse<{
  items: Game[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}>> {
  try {
    const pageNum = parseInt(page as any, 10);
    const limitNum = parseInt(limit as any, 10);

    const { items, total } = await this.gamesService.findAll(
      pageNum,
      limitNum,
      sortBy,
      sortOrder,
          search,
    );

    const message =
      items.length === 0 ? 'No record found' : 'Games retrieved successfully';

    return {
      statusCode: HttpStatus.OK,
      message,
      data: {
        items,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  } catch (error) {
    this.logger.error('Error retrieving games', error.stack);
    throw new HttpException(
      {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to retrieve games',
        error: error.message || 'Unknown error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

    /*   * Deletes a game by ID */
  @UseGuards(AuthGuard('jwt'))
@Delete(':id')
async remove(@Param('id') id: string): Promise<ApiResponse<null>> {
  try {
    await this.gamesService.remove(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Game deleted successfully',
      data: null,
    };
  } catch (error) {
    this.logger.error(`Error deleting game with id ${id}`, error.stack);
    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Failed to delete game',
        error: error.message || 'Unknown error',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
}
