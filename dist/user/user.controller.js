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
var UserController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const user_service_1 = require("./user.service");
const user_1 = require("./entities/user/user");
const update_user_dto_1 = require("../common/dto/userDto/update-user.dto");
const class_transformer_1 = require("class-transformer");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const multipart_form_guard_1 = require("../common/multipart.form.guard");
const class_validator_1 = require("class-validator");
const set_name_user_dto_1 = require("../common/dto/userDto/set-name.user.dto");
const content_type_interceptor_1 = require("../common/interceptors/content-type.interceptor");
const skip_content_type_decorator_1 = require("../common/utility/decorators/skip-content-type.decorator");
const allowedImgTypes = ['image/jpeg', 'image/jpg', 'image/png'];
let UserController = UserController_1 = class UserController {
    userService;
    logger = new common_1.Logger(UserController_1.name);
    constructor(userService) {
        this.userService = userService;
    }
    async setName(id, setNameDto) {
        try {
            const user = await this.userService.findById(id);
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            const existingName = user.name?.trim();
            if (existingName && existingName.length > 0) {
                throw new common_1.HttpException({
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Name already exist.Use update profile.',
                    error: 'NameAlreadySet',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const newName = setNameDto.name?.trim();
            if (!newName || newName.length === 0 && newName !== null && newName !== undefined) {
                throw new common_1.HttpException({
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Name must be a non-empty string',
                    error: 'InvalidName',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            user.name = newName;
            const updated = await this.userService.saveUser(user);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'Name updated successfully',
                data: (0, class_transformer_1.plainToInstance)(user_1.User, updated),
            };
        }
        catch (error) {
            this.logger.error(`Error setting name for user ${id}`, error.stack);
            throw new common_1.HttpException({
                statusCode: error.status || common_1.HttpStatus.BAD_REQUEST,
                message: error.message || 'Failed to update name',
                error: error.name || 'UnknownError',
            }, error.status || common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search, req) {
        try {
            const pageNum = parseInt(page, 10);
            const limitNum = parseInt(limit, 10);
            const { items, total } = await this.userService.findAll(pageNum, limitNum, search, sortBy, sortOrder);
            const message = items.length === 0
                ? 'No users found matching search criteria'
                : 'Users retrieved successfully';
            return {
                statusCode: common_1.HttpStatus.OK,
                message,
                data: {
                    items: (0, class_transformer_1.plainToInstance)(user_1.User, items),
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages: Math.ceil(total / limitNum),
                },
            };
        }
        catch (error) {
            this.logger.error('Error retrieving users', error.stack);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Failed to retrieve users',
                error: error.message || 'Unknown error',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            await this.userService.remove(id);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'User deleted successfully',
                data: null,
            };
        }
        catch (error) {
            this.logger.error(`Error deleting user with id ${id}`, error.stack);
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.BAD_REQUEST,
                message: 'Failed to delete user',
                error: error.message || 'Unknown error',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, file, body) {
        try {
            const updateUserDto = (0, class_transformer_1.plainToInstance)(update_user_dto_1.UpdateUserDto, body);
            const errors = await (0, class_validator_1.validate)(updateUserDto, { whitelist: true, forbidNonWhitelisted: true });
            if (errors.length > 0) {
                const messages = errors.map(err => Object.values(err.constraints || {})).flat();
                throw new common_1.HttpException({
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: messages.join(', '),
                    error: 'ValidationError',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            if (file) {
                updateUserDto['profilePicture'] = `uploads/${file.filename}`;
            }
            const userData = await this.userService.findById(id);
            if (!userData) {
                throw new common_1.NotFoundException(`User with ID ${id} not found`);
            }
            if (userData.email && (!body.email || body.email.trim() === '')) {
                throw new common_1.HttpException({
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Email cannot be empty or null because it already exists.',
                    error: 'InvalidEmailUpdate',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            if (userData.mobile && (!body.mobile || body.mobile.trim() === '')) {
                throw new common_1.HttpException({
                    statusCode: common_1.HttpStatus.BAD_REQUEST,
                    message: 'Mobile number cannot be empty or null because it already exists.',
                    error: 'InvalidMobileUpdate',
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            const updatedUser = await this.userService.update(id, updateUserDto);
            return {
                statusCode: common_1.HttpStatus.OK,
                message: 'User updated successfully',
                data: (0, class_transformer_1.plainToInstance)(user_1.User, updatedUser),
            };
        }
        catch (error) {
            this.logger.error(`Error updating user with id ${id}`, error.stack);
            throw new common_1.HttpException({
                statusCode: error.status || common_1.HttpStatus.BAD_REQUEST,
                message: error.message || 'Failed to update user',
                error: error.name || 'Unknown error',
            }, error.status || common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Patch)(':id/setname'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, set_name_user_dto_1.SetNameDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "setName", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('sortBy')),
    __param(3, (0, common_1.Query)('sortOrder')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, String, String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "remove", null);
__decorate([
    (0, skip_content_type_decorator_1.SkipContentTypeCheck)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), multipart_form_guard_1.MultipartFormGuard),
    (0, common_1.Patch)(':id'),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profilePicture', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = (0, path_1.extname)(file.originalname);
                cb(null, `profile-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (allowedImgTypes.includes(file.mimetype)) {
                cb(null, true);
            }
            else {
                cb(new common_1.HttpException({
                    statusCode: common_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                    message: 'File type not supported. Only JPG, JPEG, and PNG are allowed.',
                }, common_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE), false);
            }
        },
        limits: {
            fileSize: 2 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
exports.UserController = UserController = UserController_1 = __decorate([
    (0, common_1.UseInterceptors)(content_type_interceptor_1.ContentTypeInterceptor),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map