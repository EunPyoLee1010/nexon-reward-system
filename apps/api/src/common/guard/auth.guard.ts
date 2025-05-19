import { NexonConfigService } from '@module/module/core/config/config.service';
import { CHECK_AUTH_MSG_PATTERN } from '@module/module/define/command.constant';
import { UserSession } from '@module/module/type/session.type';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: NexonConfigService, @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {
        const jwtConfig = configService.getConfig().getJwtConfig();
        const secretOrKey = jwtConfig.jwt_secret;

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any) {
        const userInfo = { userid: payload.userid, name: payload.name, role: 0 };

        const response$ = this.authClient.send(CHECK_AUTH_MSG_PATTERN, userInfo);
        const checkAuthRes = await firstValueFrom(response$).catch((e) => {
            console.log(e);
        });

        if (!checkAuthRes?.result) {
            return null;
        }

        userInfo.role = checkAuthRes.role;

        if (!req.session) {
            req.session = UserSession.create(req, req.res);
        }
        req.session.userInfo = userInfo;

        return userInfo;
    }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
