import { SIGNIN_MSG_PATTERN, SIGNUP_MSG_PATTERN } from '@module/module/define/command.constant';
import { UserSession } from '@module/module/type/session.type';
import { Body, Controller, Get, Inject, Logger, Post, Session, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../../common/guard/auth.guard';
import { UserRegisterReqDto, UserRegisterResDto } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(@Inject('AUTH_SERVICE') private readonly authClient: ClientProxy) {}

    @UseGuards(JwtAuthGuard)
    @Get('sign-in')
    async signIn(@Session() session: UserSession, @Body() { email, passwd }: UserRegisterReqDto) {
        const res = session.getRes();
        const content = res.getContent<UserRegisterResDto>();

        const response$ = this.authClient.send(SIGNIN_MSG_PATTERN, { email, passwd });
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
    async signUp(@Session() session: UserSession, @Body() { email, name, passwd, role }: UserRegisterReqDto) {
        const res = session.getRes();
        const content = res.getContent<UserRegisterResDto>();

        const response$ = this.authClient.send(SIGNUP_MSG_PATTERN, { email, name, passwd, role });
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
