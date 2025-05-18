import {
    CREATE_EVENT_MSG_PATTERN,
    CREATE_REWARD_MSG_PATTERN,
    VIEW_EVENT_MSG_PATTERN,
    VIEW_REWARD_MSG_PATTERN,
} from '@module/module/define/command.constant';
import { UserSession } from '@module/module/type/session.type';
import { Body, Controller, Get, Inject, Param, Post, Session, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../../common/guard/auth.guard';
import { RoleGuard } from '../../common/guard/role.guard';

@Controller('event')
@UseGuards(JwtAuthGuard, RoleGuard)
export class EventController {
    constructor(@Inject('EVENT_SERVICE') private readonly authClient: ClientProxy) {}

    @Get(':eventid')
    async getEventInfo(@Session() session: UserSession, @Param('eventid') eventId?: string) {
        const res = session.getRes();
        const content = res.getContent<any>();

        const response$ = this.authClient.send(VIEW_EVENT_MSG_PATTERN, { eventId });
        const eventRes = await firstValueFrom(response$);

        if (eventRes) {
            content.result = true;
            content.response_code = 200;
            content.event_list = [];
        } else {
            content.result = false;
            content.response_code = 400;
            content.message = 'error';
        }

        return res;
    }

    @Post()
    async createEvent(
        @Session() session: UserSession,
        @Body() { title, description, started_at, ended_at, is_active, event_goal_type, event_goal_num, event_type }: any,
    ) {
        const res = session.getRes();
        const content = res.getContent<any>();

        const response$ = this.authClient.send(CREATE_EVENT_MSG_PATTERN, {
            title,
            description,
            started_at,
            ended_at,
            is_active,
            event_goal_type,
            event_goal_num,
            event_type,
        });

        const createEventResult = await firstValueFrom(response$).catch((e) => console.log(e));

        if (createEventResult) {
            content.result = true;
            content.response_code = 200;
            content.eventid = createEventResult.eventid;
        } else {
            content.result = false;
            content.response_code = 400;
            content.message = 'error';
        }

        return res;
    }

    @Get(':eventid/reward')
    async getRewardInfo(@Session() session: UserSession, @Param('eventid') eventid: string) {
        const res = session.getRes();
        const content = res.getContent<any>();

        const response$ = this.authClient.send(VIEW_REWARD_MSG_PATTERN, { eventid });
        const rewardRes = await firstValueFrom(response$).catch((e) => console.log(e));

        if (rewardRes) {
            content.result = true;
            content.response_code = 200;
            content.reward_list = [];
        } else {
            content.result = false;
            content.response_code = 400;
            content.message = 'error';
        }

        return res;
    }

    @Post(':eventid/reward')
    async createRewardInfo(@Session() session: UserSession, @Param('eventid') eventid: string, @Body() { type, grade, amount }: any) {
        const res = session.getRes();
        const content = res.getContent<any>();

        const response$ = this.authClient.send(CREATE_REWARD_MSG_PATTERN, { eventid, type, grade, amount });
        const rewardRes = await firstValueFrom(response$).catch((e) => console.log(e));

        if (rewardRes) {
            content.result = true;
            content.response_code = 200;
            content.rewardid = rewardRes.rewardid;
        } else {
            content.result = false;
            content.response_code = 400;
            content.message = 'error';
        }

        return res;
    }
}
