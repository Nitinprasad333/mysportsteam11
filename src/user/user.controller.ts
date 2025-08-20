import {
  Controller,
  Get,
  Query,
  HttpStatus,
  UseGuards,
  Request,
  HttpException,
  Logger,
  Delete,
  Param,
  Body,
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  NotFoundException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { ApiResponse } from 'src/common/interface/response.interface';
import { User } from './entities/user/user';
import { UpdateUserDto } from 'src/common/dto/userDto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { MultipartFormGuard } from 'src/common/multipart.form.guard';
import { validate } from 'class-validator';
import { SetNameDto } from 'src/common/dto/userDto/set-name.user.dto';
import { ContentTypeInterceptor } from 'src/common/interceptors/content-type.interceptor';
import { SkipContentTypeCheck } from 'src/common/utility/decorators/skip-content-type.decorator';

const allowedImgTypes = ['image/jpeg', 'image/jpg', 'image/png'];

@UseInterceptors(ContentTypeInterceptor)
@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  /*Add New User Name*/
  // @UseGuards(AuthGuard('jwt'))
  @Patch(':id/setname')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async setName(
    @Param('id', ParseIntPipe) id: number,
    @Body() setNameDto: SetNameDto,
  ): Promise<ApiResponse<any>> {
    try {
      const user = await this.userService.findById(id);

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const existingName = user.name?.trim();

      if (existingName && existingName.length > 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Name already exist.Use update profile.',
            error: 'NameAlreadySet',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const newName = setNameDto.name?.trim();

      if (
        !newName ||
        (newName.length === 0 && newName !== null && newName !== undefined)
      ) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Name must be a non-empty string',
            error: 'InvalidName',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      user.name = newName;
      const updated = await this.userService.saveUser(user);

      return {
        statusCode: HttpStatus.OK,
        message: 'Name updated successfully',
        data: plainToInstance(User, updated),
      };
    } catch (error) {
      this.logger.error(`Error setting name for user ${id}`, error.stack);
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to update name',
          error: error.name || 'UnknownError',
        },
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  /*Get all users with pagination, sorting, and search*/
  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
    @Query('search') search: string,
    @Request() req,
  ): Promise<
    ApiResponse<{
      items: User[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>
  > {
    try {
      const pageNum = parseInt(page as any, 10);
      const limitNum = parseInt(limit as any, 10);

      const { items, total } = await this.userService.findAll(
        pageNum,
        limitNum,
        search,
        sortBy,
        sortOrder,
      );

      const message =
        items.length === 0
          ? 'No users found matching search criteria'
          : 'Users retrieved successfully';

      return {
        statusCode: HttpStatus.OK,
        message,
        data: {
          items: plainToInstance(User, items),
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      };
    } catch (error) {
      this.logger.error('Error retrieving users', error.stack);
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to retrieve users',
          error: error.message || 'Unknown error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /*Delete user by id*/
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<ApiResponse<null>> {
    try {
      await this.userService.remove(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'User deleted successfully',
        data: null,
      };
    } catch (error) {
      this.logger.error(`Error deleting user with id ${id}`, error.stack);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Failed to delete user',
          error: error.message || 'Unknown error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /*update user check auth guard with header multipart form data guard and skip content-type*/
  @SkipContentTypeCheck()
  @UseGuards(AuthGuard('jwt'), MultipartFormGuard)
  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `profile-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (allowedImgTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(
            new HttpException(
              {
                statusCode: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                message:
                  'File type not supported. Only JPG, JPEG, and PNG are allowed.',
              },
              HttpStatus.UNSUPPORTED_MEDIA_TYPE,
            ),
            false,
          );
        }
      },
      limits: {
        fileSize: 2 * 1024 * 1024, // Optional: 2MB max size
      },
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,

    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ): Promise<ApiResponse<any>> {
    try {
      const updateUserDto: UpdateUserDto = plainToInstance(UpdateUserDto, body);

      const errors = await validate(updateUserDto, {
        whitelist: true,
        forbidNonWhitelisted: true,
      });

      if (errors.length > 0) {
        const messages = errors
          .map((err) => Object.values(err.constraints || {}))
          .flat();
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: messages.join(', '),
            error: 'ValidationError',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (file) {
        updateUserDto['profilePicture'] = `uploads/${file.filename}`;
      }

      const userData = await this.userService.findById(id);
      if (!userData) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Prevent updating email/mobile to null/blank if already set
      if (userData.email && (!body.email || body.email.trim() === '')) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Email cannot be empty or null because it already exists.',
            error: 'InvalidEmailUpdate',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (userData.mobile && (!body.mobile || body.mobile.trim() === '')) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message:
              'Mobile number cannot be empty or null because it already exists.',
            error: 'InvalidMobileUpdate',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // // Clean up email/mobile before passing to service
      // if (updateUserDto.email?.trim() === '') {
      //   delete updateUserDto.email;
      // }
      // if (updateUserDto.mobile?.trim() === '') {
      //   delete updateUserDto.mobile;
      // }

      const updatedUser = await this.userService.update(id, updateUserDto);

      return {
        statusCode: HttpStatus.OK,
        message: 'User updated successfully',
        data: plainToInstance(User, updatedUser),
      };
    } catch (error) {
      this.logger.error(`Error updating user with id ${id}`, error.stack);
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.BAD_REQUEST,
          message: error.message || 'Failed to update user',
          error: error.name || 'Unknown error',
        },
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
