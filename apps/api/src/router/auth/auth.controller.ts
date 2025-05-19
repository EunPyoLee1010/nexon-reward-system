import { SIGNIN_MSG_PATTERN, SIGNUP_MSG_PATTERN } from '@module/module/define/command.constant';
import { UserSession } from '@module/module/type/session.type';
import { Body, Controller, Inject, Logger, Post, Session } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserLoginReqDto, UserRegisterReqDto, UserRegisterResDto } from '../../../../../libs/module/src/type/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}

    @Post('sign-in')
    async signIn(@Session() session: UserSession, @Body() { userid, passwd }: UserLoginReqDto) {
        const res = session.getRes();
        const content = res.getContent<UserRegisterResDto>();

        const response$ = this.authClient.send(SIGNIN_MSG_PATTERN, { userid, passwd });
        const tokenRes = await firstValueFrom<{ result: boolean; message?: string; token?: string }>(response$).catch((e) => {
            Logger.error(e);
            return { result: false, message: e, token: undefined };
        });

        if (tokenRes.result) {
            content.result = true;
            content.response_code = 200;
            content.token = tokenRes.token;
        } else {
            content.result = false;
            content.response_code = 400;
            content.message = tokenRes.message;
        }
        return res;
    }

    @Post('sign-up')
    async signUp(@Session() session: UserSession, @Body() { userid, name, passwd, role }: UserRegisterReqDto) {
        const res = session.getRes();
        const content = res.getContent<UserRegisterResDto>();

        const response$ = this.authClient.send(SIGNUP_MSG_PATTERN, { userid, name, passwd, role });
        const tokenRes = await firstValueFrom<{ result: boolean; message?: string; token?: string }>(response$).catch((e) => {
            Logger.error(e);
            return { result: false, message: e, token: undefined };
        });

        if (tokenRes.result) {
            content.result = true;
            content.response_code = 200;
            content.token = tokenRes.token;
        } else {
            content.result = false;
            content.response_code = 400;
            content.message = tokenRes.message;
        }
        return res;
    }
}
