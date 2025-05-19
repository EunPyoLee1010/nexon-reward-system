import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class EventInfoReqBean {
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => +value)
    eventid: number;
}

export class CreateEventReqBean {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsDateString()
    started_at: Date;

    @IsDateString()
    ended_at: Date;

    @IsBoolean()
    is_active?: boolean;

    @IsString()
    event_type: string;

    @IsString()
    event_goal_type: string;

    @IsNumber()
    event_goal_num: number;
}
