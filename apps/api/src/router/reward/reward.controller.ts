import { REQUEST_REWARD_MSG_PATTERN, VIEW_REQUEST_REWARD_LOG_MSG_PATTERN } from '@module/module/define/command.constant';
import { UserSession } from '@module/module/type/session.type';
import { Body, Controller, Get, Inject, Post, Query, Session, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../../common/guard/auth.guard';
import { RoleGuard } from '../../common/guard/role.guard';

@Controller('reward')
@UseGuards(JwtAuthGuard, RoleGuard)
export class RewardController {
    constructor(@Inject('EVENT_SERVICE') private readonly authClient: ClientProxy) {}

    @Post('request')
    async requestReward(@Session() session: UserSession, @Body() { eventid }: any) {
        const res = session.getRes();
        const content = res.getContent<any>();

        const response$ = this.authClient.send(REQUEST_REWARD_MSG_PATTERN, { eventid });
        const requestRes = await firstValueFrom(response$);

        if (requestRes) {
            content.result = true;
        } else {
            content.result = false;
            content.message = 'error';
        }

        return res;
    }

    @Get('request/log')
    async signUp(@Session() session: UserSession, @Query() { eventid, request_result }: any) {
        const res = session.getRes();
        const content = res.getContent<any>();

        const response$ = this.authClient.send(VIEW_REQUEST_REWARD_LOG_MSG_PATTERN, { userid: session.userId, eventid, request_result });
        const logResult = await firstValueFrom(response$).catch((e) => console.log(e));

        if (logResult) {
            content.result = true;
            content.log_list = [];
        } else {
            content.result = false;
            content.message = 'error';
        }

        return res;
    }
}
