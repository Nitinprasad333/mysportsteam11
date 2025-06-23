import { Repository } from 'typeorm';
import { User } from './entities/user/user';
import { UpdateUserDto } from 'src/common/dto/userDto/update-user.dto';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    create(userData: {
        email?: string;
        mobile?: string;
    }): Promise<User>;
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findByMobile(mobile: string): Promise<User | null>;
    updateRefreshToken(id: number, token: string): Promise<User>;
    removeRefreshToken(id: number): Promise<User>;
    saveUser(user: User): Promise<User>;
    findAll(page: number, limit: number, search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc'): Promise<{
        items: User[];
        total: number;
    }>;
    remove(id: number): Promise<void>;
    update(id: number, updateUserDto: Partial<UpdateUserDto>): Promise<User>;
}
