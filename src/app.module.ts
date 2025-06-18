import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { DatabaseService } from './database/database.service';
import { MailService } from './mail/mail.service';
import { ConfigModule } from '@nestjs/config';
import { GamesModule } from './games/games.module';

@Module({
  imports: [
        ConfigModule.forRoot({
      isGlobal: true, // loads .env automatically
    }),
    TypeOrmModule.forRoot({
      type: 'mysql', // or 'mysql'
      host: process.env.SQL_HOST,
      port: Number(process.env.SQL_PORT), // change to 3306 for MySQL
      username: process.env.SQL_USER_NAME,
      password: process.env.SQL_DB_PASSWORD,
      database: process.env.SQL_DATABASE,
      autoLoadEntities: true,
      synchronize: true, // disable in production

    }),
    AuthModule,
    UserModule,
    GamesModule,
  ],
  controllers: [AppController],
  providers: [AppService,DatabaseService, MailService],
  exports: [MailService],
})
export class AppModule {}
