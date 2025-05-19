import { IsNumber, IsString } from 'class-validator';

export class CreateRewardDto {
    @IsNumber()
    eventid: number;

    @IsNumber()
    type: number;

    @IsString()
    name: string;

    @IsNumber()
    grade: number;

    @IsNumber()
    amount: number;
}
