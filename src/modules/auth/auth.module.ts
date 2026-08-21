import { Module } from '@nestjs/common';
import { AuthController } from './presentation/auth.controller';
import { GetAllUsersHandler } from './application/queries/GetAllUsers/get-all-users.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminUserOrmEntity } from './infrastructure/persistence/orm-entities/admin-user.orm-entity';
import { RefreshTokenOrmEntity } from './infrastructure/persistence/orm-entities/refresh-token.orm-entity';
import { ADMIN_USER_REPOSITORY } from './domain/repositories/admin-user.repository.interface';
import { AdminUserRepository } from './infrastructure/repositories/admin-user.repository';
import { REFRESH_TOKEN_REPOSITORY } from './domain/repositories/refresh-token.repository.interface';
import { RefreshTokenRepository } from './infrastructure/repositories/refresh-token.repository';
import { CreateStaffUserHandler } from './application/commands/CreateStaffUser/create-staff-user.handler';
import { LoginHandler } from './application/commands/login/login.handler';
import { RefreshTokenHandler } from './application/commands/RefreshTokenCommand/refresh-token.handler';
import { PASSWORD_HASHER } from './domain/services/password-hasher.interface';
import { Argon2PasswordHasher } from './infrastructure/services/argon2-password-hasher';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StaffUserController } from './presentation/staff-user.controller';

const commandHandler = [CreateStaffUserHandler, LoginHandler, RefreshTokenHandler];
const queriesHandler = [GetAllUsersHandler];

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([AdminUserOrmEntity, RefreshTokenOrmEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, StaffUserController],
  providers: [
    { provide: ADMIN_USER_REPOSITORY, useClass: AdminUserRepository },
    { provide: REFRESH_TOKEN_REPOSITORY, useClass: RefreshTokenRepository },
    { provide: PASSWORD_HASHER, useClass: Argon2PasswordHasher },
    ...commandHandler,
    ...queriesHandler
  ]
})
export class AuthModule { }
