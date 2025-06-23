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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_1 = require("./entities/user/user");
const bcrypt = require("bcrypt");
let UserService = class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(userData) {
        const defaultUserFields = {
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
    async findById(id) {
        return this.userRepository.findOne({ where: { id } });
    }
    async findByEmail(email) {
        return this.userRepository.findOne({ where: { email } });
    }
    async findByMobile(mobile) {
        return this.userRepository.findOne({ where: { mobile } });
    }
    async updateRefreshToken(id, token) {
        const hashedToken = await bcrypt.hash(token, 10);
        return this.update(id, { refreshToken: hashedToken });
    }
    async removeRefreshToken(id) {
        return this.update(id, { refreshToken: '' });
    }
    async saveUser(user) {
        return await this.userRepository.save(user);
    }
    async findAll(page, limit, search, sortBy = 'createdAt', sortOrder = 'desc') {
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        if (search && search.trim() !== '') {
            queryBuilder.where('LOWER(user.name) LIKE :search', {
                search: `%${search.toLowerCase()}%`,
            });
        }
        queryBuilder
            .orderBy(`user.${sortBy}`, sortOrder.toUpperCase())
            .skip((page - 1) * limit)
            .take(limit);
        const [items, total] = await queryBuilder.getManyAndCount();
        return { items, total };
    }
    async remove(id) {
        const result = await this.userRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
    }
    async update(id, updateUserDto) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        Object.assign(user, updateUserDto);
        return await this.userRepository.save(user);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map