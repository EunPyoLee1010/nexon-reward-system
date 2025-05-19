import { NexonAbstractReqBean, NexonAbstractResBean } from '@module/module/define/dto.constant';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { ENUM_USER_ROLE_STRING } from '../core/mongo/schema/user.mongo.schema';

export class UserLoginReqDto extends NexonAbstractReqBean {
    @IsNumber()
    userid: number;

    @IsString()
    passwd: string;
}

export class UserRegisterReqDto extends NexonAbstractReqBean {
    @IsNumber()
    userid: number;

    @IsString()
    name: string;

    @IsString()
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/, { message: '비밀번호는 숫자, 문자, 특수문자 최소 1개씩 존재해야합니다.' })
    @MinLength(10, { message: '비밀번호는 최소 10자 이상이어야 합니다.' })
    @Transform(({ value }) => value.trim())
    passwd: string;

    @IsEnum(ENUM_USER_ROLE_STRING)
    @IsOptional()
    role?: ENUM_USER_ROLE_STRING;
}

export class UserRegisterResDto extends NexonAbstractResBean {
    token?: string;
}
