import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginCommand } from "./login.command";
import { Inject } from "@nestjs/common";
import { ADMIN_USER_REPOSITORY, type IAdminUserRepository } from "src/modules/auth/domain/repositories/admin-user.repository.interface";
import { type IRefreshTokenRepository, REFRESH_TOKEN_REPOSITORY } from "src/modules/auth/domain/repositories/refresh-token.repository.interface";
import { InvalidCredentialsException } from "src/modules/auth/domain/execptions/auth.exceptions";
import { JwtService } from "@nestjs/jwt";
import { generateRawToken, hashToken } from "../../services/token-hash.util";
import { RefreshToken } from "src/modules/auth/domain/entities/refresh-token.entity";
import { type IPasswordHasher, PASSWORD_HASHER } from "src/modules/auth/domain/services/password-hasher.interface";

interface LoginResult {
    accessToken: string;
    refreshToken: string;
    user: { id: string; email: string; role: string }
}

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
    constructor(
        @Inject(ADMIN_USER_REPOSITORY) private readonly userRepository: IAdminUserRepository,
        @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTOkenRepository: IRefreshTokenRepository,
        @Inject(PASSWORD_HASHER) private readonly passwordHasher: IPasswordHasher,
        private readonly jwtService: JwtService
    ) { }

    async execute(command: LoginCommand): Promise<LoginResult> {

        const user = await this.userRepository.findByEmail(command.email);
        if (!user || !user.isActive) throw new InvalidCredentialsException();

        const passwordMatches = await this.passwordHasher.verify(user.passwordHash, command.password);
        if (!passwordMatches) throw new InvalidCredentialsException();

        const accessToken = this.jwtService.sign(
            { sub: user.id, email: user.email, role: user.role },
            { expiresIn: '15m' }
        );

        const rawRefreshToken = generateRawToken();
        const refreshTokenEntity = RefreshToken.create(user.id, hashToken(rawRefreshToken));
        await this.refreshTOkenRepository.save(refreshTokenEntity);

        return {
            accessToken,
            refreshToken: rawRefreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        }

    }
}