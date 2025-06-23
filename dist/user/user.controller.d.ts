import { UserService } from './user.service';
import { ApiResponse } from 'src/common/interface/response.interface';
import { User } from './entities/user/user';
import { SetNameDto } from 'src/common/dto/userDto/set-name.user.dto';
export declare class UserController {
    private readonly userService;
    private readonly logger;
    constructor(userService: UserService);
    setName(id: number, setNameDto: SetNameDto): Promise<ApiResponse<any>>;
    findAll(page: number | undefined, limit: number | undefined, sortBy: string | undefined, sortOrder: "asc" | "desc" | undefined, search: string, req: any): Promise<ApiResponse<{
        items: User[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>>;
    remove(id: number): Promise<ApiResponse<null>>;
    update(id: number, file: Express.Multer.File, body: any): Promise<ApiResponse<any>>;
}
