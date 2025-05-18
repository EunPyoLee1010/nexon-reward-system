import { SIGNIN_MSG_PATTERN, SIGNUP_MSG_PATTERN } from '@module/module/define/command.constant';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthRepository } from './auth.repository';

@Controller()
export class AuthService {
    constructor(private readonly authRepo: AuthRepository) {}

    // 로그인
    @MessagePattern(SIGNIN_MSG_PATTERN)
    signInUser() {
        return { userId: 1, roles: ['user'], email: 'test@example.com' };
    }

    // 계정 생성
    @MessagePattern(SIGNUP_MSG_PATTERN)
    signUpUser() {
        return { statusCode: 200, result: true, token: '' };
    }
}
