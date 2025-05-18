import { NexonAbstractReqBean, NexonAbstractResBean } from '@module/module/define/dto.constant';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class UserLoginReqDto extends NexonAbstractReqBean {
    @IsEmail()
    email: string;

    @IsString()
    passwd: string;
}

export class UserRegisterReqDto extends NexonAbstractReqBean {
    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsString()
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/, { message: '비밀번호는 숫자, 문자, 특수문자 최소 1개씩 존재해야합니다.' })
    @MinLength(10, { message: '비밀번호는 최소 10자 이상이어야 합니다.' })
    @Transform(({ value }) => value.trim())
    passwd: string;

    @IsString()
    role?: string;
}

export class UserRegisterResDto extends NexonAbstractResBean {
    token?: string;
}
