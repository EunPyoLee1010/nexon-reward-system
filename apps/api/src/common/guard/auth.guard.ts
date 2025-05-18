import { NexonConfigService } from '@module/module/core/config/config.service';
import { UserSession } from '@module/module/type/session.type';
import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Request, Response } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: NexonConfigService) {
        const jwtConfig = configService.getConfig().getJwtConfig();
        const secretOrKey = jwtConfig.jwt_secret;

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, res: Response, payload: any) {
        const userInfo = { userId: payload.sub, email: payload.email, roles: payload.roles };
        if (!req.session) {
            req.session = UserSession.create(req, res);
        }
        req.session.userInfo = userInfo;

        return null;
    }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
