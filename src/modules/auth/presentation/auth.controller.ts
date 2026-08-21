import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { LoginDto, RefreshTokenDto } from './dtos/login.dto';
import { LoginCommand } from '../application/commands/login/login.command';
import { RefreshTokenCommand } from '../application/commands/RefreshTokenCommand/refresh-token.command';

@Controller('auth')
export class AuthController {

    constructor(private readonly commandBus: CommandBus) { }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        return this.commandBus.execute(new LoginCommand(dto.email, dto.password));
    }

    @Post('refresh')
    async refresh(@Body() dto: RefreshTokenDto) {
        return this.commandBus.execute(new RefreshTokenCommand(dto.refreshTokenId, dto.refreshToken));
    }
}
