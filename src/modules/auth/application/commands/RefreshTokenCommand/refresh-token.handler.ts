import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RefreshTokenCommand } from "./refresh-token.command";
import { Inject } from "@nestjs/common";
import { type IRefreshTokenRepository, REFRESH_TOKEN_REPOSITORY } from "src/modules/auth/domain/repositories/refresh-token.repository.interface";
import { ADMIN_USER_REPOSITORY, type IAdminUserRepository } from "src/modules/auth/domain/repositories/admin-user.repository.interface";
import { JwtService } from "@nestjs/jwt";
import { RefreshTokenInvalidException } from "src/modules/auth/domain/execptions/auth.exceptions";
import { generateRawToken, hashToken } from "../../services/token-hash.util";
import { RefreshToken } from "src/modules/auth/domain/entities/refresh-token.entity";

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand> {

    constructor(
        @Inject(REFRESH_TOKEN_REPOSITORY) private readonly refreshTokenRepository: IRefreshTokenRepository,
        @Inject(ADMIN_USER_REPOSITORY) private readonly userRepository: IAdminUserRepository,
        private readonly jwtService: JwtService
    ) { }

    async execute(command: RefreshTokenCommand): Promise<any> {

        const existingToken = await this.refreshTokenRepository.findById(command.refreshTokenId);
        if (!existingToken) throw new RefreshTokenInvalidException();

        // Verificar si el token ha sido revocado
        if (existingToken.isRevoked) {
            await this.refreshTokenRepository.revokeAllForUser(existingToken.userId);
            throw new RefreshTokenInvalidException();
        }

        // Verificar si el token ha expirado o si el hash no coincide
        if (existingToken.isExpired() || hashToken(command.rawToken) !== existingToken.tokenHash)
            throw new RefreshTokenInvalidException();

        // Verificar que el usuario exista y esté activo
        const user = await this.userRepository.findById(existingToken.userId);
        if (!user || !user.isActive) throw new RefreshTokenInvalidException();

        // Crear nuevo par de tokens
        const rawNewToken = generateRawToken();
        const newTokenEntity = RefreshToken.create(user.id, hashToken(rawNewToken));
        await this.refreshTokenRepository.save(newTokenEntity);

        // Revocar token antiguo
        existingToken.revoke(newTokenEntity.id);
        await this.refreshTokenRepository.save(existingToken);

        // Generar nuevo access token
        const accessToken = this.jwtService.sign(
            { sub: user.id, email: user.email, role: user.role },
            { expiresIn: '15m' }
        );

        return {
            accessToken, refreshToken: rawNewToken, refreshTokenId: newTokenEntity.id
        }

    }

}