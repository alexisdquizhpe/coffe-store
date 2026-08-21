import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        // Si no hay roles definidos, todos pueden acceder
        if (!requiredRoles) return true;

        // Obtenemos el usuario de la solicitud (gracias a JwtAuthGuard)
        const { user } = context.switchToHttp().getRequest();
        if (!requiredRoles.includes(user.role)) throw new ForbiddenException('No tienes permisos para esta acción.');

        return true;
    }
}