import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { GamesService } from './games.service';
import { GamesController } from './games.controller';
import { Game } from './entities/game';
import { AuthModule } from '../auth/auth.module'; // Adjust path if needed

@Module({
  imports: [
    TypeOrmModule.forFeature([Game]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule, 
  ],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}