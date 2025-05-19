import { ENUM_USER_ROLE } from '@module/module/core/mongo/schema/user.mongo.schema';
import { CHECK_ROLE } from '@module/module/define/command.constant';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest<Request>();

        if (!req.session) return false;

        const routerRole = this.reflector.get<number>(CHECK_ROLE, context.getHandler()) ?? ENUM_USER_ROLE.ADMIN;
        const checkRole = routerRole & req.session.userInfo.role;

        return routerRole === checkRole;
    }
}
