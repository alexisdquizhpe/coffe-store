import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActive(context: ExecutionContext) {
        // Para fines de desarrollo
        if (process.env.AUTH_ENABLED === 'false') return true;

        // Lógica normal de autenticación
        return super.canActivate(context);
    }
}