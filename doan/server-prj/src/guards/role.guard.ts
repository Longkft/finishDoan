import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccessControl } from 'accesscontrol';
import { DecoratorMetadataKey } from 'src/common/enums/decorator.enum';
import { IResourceAuthorization } from 'src/common/interfaces/decorator.interface';
import { ExtendedRequest } from 'src/common/interfaces/extended-request.interface';
import { RbacService } from 'src/services/rbac.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly rbacService: RbacService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.get<IResourceAuthorization>(
            DecoratorMetadataKey.RESOURCE_AUTHORIZATION,
            context.getHandler(),
        );

        if (!requiredRoles) {
            return true;
        }
        const rbac = new AccessControl();
        const request = context.switchToHttp().getRequest<ExtendedRequest>();

        const roles = await this.rbacService.roleList();
        if (roles.findIndex((rol) => rol.role === request.user.role) < 0) {
            throw new UnauthorizedException("You don't have enough permission...");
        }

        rbac.setGrants(roles);
        const enable = rbac.can(request.user.role)[requiredRoles.permission](requiredRoles.resourceName);

        if (!enable.granted) {
            throw new UnauthorizedException("You don't have enough permission...");
        }
        return true;
    }
}
